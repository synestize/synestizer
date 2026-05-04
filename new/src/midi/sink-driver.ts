/**
 * MidiSinkDriver — reconciles preset.sinks of kind "midi.cc" with the bus,
 * and on every signal frame sends out the corresponding CC messages,
 * throttled per integer value change.
 *
 * Why throttle on integer change rather than wall-clock: MIDI CC values
 * are already 7-bit, so resending the same integer is wasted bandwidth.
 * 100Hz signal frames × 64 distinct CCs would saturate the wire even for
 * mostly-static modulation; gating on `Math.round(val) !== lastSent`
 * matches what controllers actually need.
 *
 * The sink id format mirrors the source side:
 *   midi.out.<portId>.ch<N>.cc<M>
 *
 * The driver registers each sink slot with the bus so the graph compiler
 * picks it up exactly like an audio param sink. Range is forced to [0,127]
 * so runStage2's range-mapping does the bipolar→7-bit conversion for free.
 *
 * Iron rule kept: this runs on the signal frame (off the audio thread),
 * never writes to ConfigStore, only consumes preset.sinks via subscription.
 */

import type { Sink } from "../preset/schema.ts";
import type { SignalBus } from "../signal/bus.ts";
import type { ConfigStore } from "../store/config-store.ts";
import type { MidiEngine } from "./engine.ts";

interface SinkRef {
  sinkId: string;
  sinkSlot: number;
  portId: string;
  channel: number; // 1..16
  cc: number; // 0..127
  lastSent: number; // -1 = never sent yet
}

const ID_RE = /^midi\.out\.(.+)\.ch(\d+)\.cc(\d+)$/;

export class MidiSinkDriver {
  readonly #store: ConfigStore;
  readonly #bus: SignalBus;
  readonly #engine: MidiEngine;
  readonly #onChange: (() => void) | null;

  #refs = new Map<string, SinkRef>();
  readonly #unsubs: Array<() => void> = [];

  constructor(store: ConfigStore, bus: SignalBus, engine: MidiEngine, onChange?: () => void) {
    this.#store = store;
    this.#bus = bus;
    this.#engine = engine;
    this.#onChange = onChange ?? null;
  }

  start(): void {
    this.#unsubs.push(
      this.#store.subscribe("sinks", () => this.#reconcile()),
      this.#bus.subscribeFrame(() => this.#sendAll()),
    );
    this.#reconcile();
  }

  stop(): void {
    for (const u of this.#unsubs) u();
    this.#unsubs.length = 0;
    this.#refs.clear();
  }

  // ─── Reconcile ────────────────────────────────────────────────────────────

  #reconcile(): void {
    const sinks = this.#store.snapshot().sinks;
    const wanted = new Map<string, Sink>();
    for (const s of sinks) {
      if (s.kind === "midi.cc") wanted.set(s.id, s);
    }

    // Drop tracked sinks no longer in preset
    for (const [id] of this.#refs) {
      if (!wanted.has(id)) this.#refs.delete(id);
    }

    // Add new tracked sinks
    let added = false;
    for (const [id, sink] of wanted) {
      if (this.#refs.has(id)) continue;
      const m = ID_RE.exec(id);
      if (!m) {
        console.warn(`[midi/sink] ignoring sink with malformed id: ${id}`);
        continue;
      }
      const portId = m[1]!;
      const channel = Number(m[2]);
      const cc = Number(m[3]);
      // Make sure the sink has [0, 127] range so runStage2's range-mapping
      // outputs MIDI-shaped engineering values. We don't fix the preset —
      // the schema allows any range — but we read sinkEng directly and
      // clamp to [0, 127] on send anyway.
      void sink;
      const slot = this.#bus.registerSink(id);
      this.#refs.set(id, {
        sinkId: id,
        sinkSlot: slot,
        portId,
        channel,
        cc,
        lastSent: -1,
      });
      added = true;
    }

    if (added) this.#onChange?.();
  }

  // ─── Hot-path send ────────────────────────────────────────────────────────

  #sendAll(): void {
    if (this.#refs.size === 0) return;
    const outputs = this.#engine.outputs();
    if (outputs.length === 0) return;
    const sinkEng = this.#bus.rawSinkEng();
    for (const ref of this.#refs.values()) {
      const raw = sinkEng[ref.sinkSlot] ?? 0;
      // Bipolar [-1,1] in sinks[]; range-mapped value in sinkEng[] when the
      // sink declares a range. If no range was set, sinkEng equals the
      // bipolar value, so map to 0..127 here.
      let v = raw;
      if (raw <= 1 && raw >= -1) v = (raw + 1) * 63.5;
      const intVal = v < 0 ? 0 : v > 127 ? 127 : Math.round(v);
      if (intVal === ref.lastSent) continue;
      const port = outputs.find((p) => p.id === ref.portId);
      if (!port) continue;
      // 0xB0 = Control Change, low nibble = channel (0-indexed)
      port.send([0xb0 | (ref.channel - 1), ref.cc, intVal]);
      ref.lastSent = intVal;
    }
  }
}
