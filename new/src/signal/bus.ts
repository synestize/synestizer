/**
 * SignalBus — the fast, ephemeral, never-persisted tier.
 *
 * Three Float32Array slot pools:
 *   - sources: dynamic, registered by engines (video, MIDI, etc.)
 *   - generics: fixed at 8, names α…θ, indexed by the matrix
 *   - sinks: dynamic, registered by voices and bound to audio params
 *
 * Iron rule: nothing here ever crosses into ConfigStore.
 * UI meters/scopes read these arrays on rAF, not via push subscription.
 *
 * Per-frame allocations: ZERO. All buffers reused.
 */

import { GENERIC_COUNT, GENERIC_LABELS } from "../preset/schema.ts";

export { GENERIC_COUNT, GENERIC_LABELS };

const INITIAL_CAPACITY = 64;

export class SignalBus {
  // Float32Array storage. Capacity grows as registrations arrive.
  #sources: Float32Array;
  #sinks: Float32Array;
  readonly #generics: Float32Array;

  // Engineering-unit outputs (post bias+scale+range). Same length as sinks.
  #sinkEng: Float32Array;

  #sourceCount = 0;
  #sinkCount = 0;

  readonly #sourceIdToSlot = new Map<string, number>();
  readonly #sinkIdToSlot = new Map<string, number>();
  readonly #sourceIds: string[] = [];
  readonly #sinkIds: string[] = [];
  readonly #sourceLabels = new Map<string, string>();

  readonly #frameCallbacks = new Set<() => void>();
  readonly #sourceListeners = new Set<(id: string) => void>();

  constructor() {
    this.#sources = new Float32Array(INITIAL_CAPACITY);
    this.#sinks = new Float32Array(INITIAL_CAPACITY);
    this.#generics = new Float32Array(GENERIC_COUNT);
    this.#sinkEng = new Float32Array(INITIAL_CAPACITY);
  }

  // ─── Registration ─────────────────────────────────────────────────────────

  /**
   * Register a source slot. Idempotent — second registration returns the
   * same slot. Optional human-readable label, used by the UI source picker
   * and matrix; falls back to `id` if absent.
   */
  registerSource(id: string, label?: string): number {
    const existing = this.#sourceIdToSlot.get(id);
    if (existing !== undefined) {
      // Allow late label upgrade — keeps "we got CC traffic before we knew
      // the port name" out of the way.
      if (label !== undefined) this.#sourceLabels.set(id, label);
      return existing;
    }
    const slot = this.#sourceCount++;
    if (this.#sources.length <= slot) this.#growSources(slot + 1);
    this.#sourceIdToSlot.set(id, slot);
    this.#sourceIds[slot] = id;
    if (label !== undefined) this.#sourceLabels.set(id, label);
    for (const cb of this.#sourceListeners) cb(id);
    return slot;
  }

  /** Friendly label, or undefined if none was registered. */
  sourceLabel(id: string): string | undefined {
    return this.#sourceLabels.get(id);
  }

  /** Notified once per newly-registered source id. UI picker hooks this. */
  onSourceRegistered(cb: (id: string) => void): () => void {
    this.#sourceListeners.add(cb);
    return () => {
      this.#sourceListeners.delete(cb);
    };
  }

  registerSink(id: string): number {
    const existing = this.#sinkIdToSlot.get(id);
    if (existing !== undefined) return existing;
    const slot = this.#sinkCount++;
    if (this.#sinks.length <= slot) this.#growSinks(slot + 1);
    this.#sinkIdToSlot.set(id, slot);
    this.#sinkIds[slot] = id;
    return slot;
  }

  sourceSlot(id: string): number | undefined {
    return this.#sourceIdToSlot.get(id);
  }

  sinkSlot(id: string): number | undefined {
    return this.#sinkIdToSlot.get(id);
  }

  get sourceCount(): number {
    return this.#sourceCount;
  }

  get sinkCount(): number {
    return this.#sinkCount;
  }

  /** Read-only: source/sink id by slot. */
  sourceId(slot: number): string | undefined {
    return this.#sourceIds[slot];
  }

  sinkId(slot: number): string | undefined {
    return this.#sinkIds[slot];
  }

  // ─── Hot-path raw arrays ──────────────────────────────────────────────────

  /** Internal: graph compiler reads these. Don't write from outside the scheduler. */
  rawSources(): Float32Array {
    return this.#sources;
  }

  rawSinks(): Float32Array {
    return this.#sinks;
  }

  rawGenerics(): Float32Array {
    return this.#generics;
  }

  rawSinkEng(): Float32Array {
    return this.#sinkEng;
  }

  // ─── Hot-path read/write (zero allocations) ───────────────────────────────

  writeSource(slot: number, value: number): void {
    this.#sources[slot] = value;
  }

  readSource(slot: number): number {
    return this.#sources[slot] ?? 0;
  }

  readSink(slot: number): number {
    return this.#sinks[slot] ?? 0;
  }

  readSinkEng(slot: number): number {
    return this.#sinkEng[slot] ?? 0;
  }

  readGeneric(slot: number): number {
    return this.#generics[slot] ?? 0;
  }

  /**
   * Resolve a combo-bus key into (arrayRef, slotIdx). Used by graph compiler.
   * Returns null if key not found.
   *
   *   "generic.0".."generic.7" → (rawGenerics, 0..7)
   *   "<sourceId>"             → (rawSources, slot)
   */
  resolveCombo(key: string): { array: Float32Array; slot: number } | null {
    if (key.startsWith("generic.")) {
      const n = Number(key.slice(8));
      if (Number.isInteger(n) && n >= 0 && n < GENERIC_COUNT) {
        return { array: this.#generics, slot: n };
      }
      return null;
    }
    const slot = this.#sourceIdToSlot.get(key);
    if (slot === undefined) return null;
    return { array: this.#sources, slot };
  }

  // ─── Frame coordination ───────────────────────────────────────────────────

  /** Subscribe to per-tick frame callback. Called once per signal tick after Stage 2. */
  subscribeFrame(cb: () => void): () => void {
    this.#frameCallbacks.add(cb);
    return () => {
      this.#frameCallbacks.delete(cb);
    };
  }

  /** Internal: scheduler invokes this once per tick. */
  emitFrame(): void {
    for (const cb of this.#frameCallbacks) cb();
  }

  // ─── Growth (rare, on registration only) ──────────────────────────────────

  #growSources(want: number): void {
    let cap = this.#sources.length || 1;
    while (cap < want) cap *= 2;
    const grown = new Float32Array(cap);
    grown.set(this.#sources);
    this.#sources = grown;
  }

  #growSinks(want: number): void {
    let cap = this.#sinks.length || 1;
    while (cap < want) cap *= 2;
    const grownVal = new Float32Array(cap);
    grownVal.set(this.#sinks);
    this.#sinks = grownVal;
    const grownEng = new Float32Array(cap);
    grownEng.set(this.#sinkEng);
    this.#sinkEng = grownEng;
  }
}
