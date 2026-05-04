/**
 * MidiEngine — wraps `navigator.requestMIDIAccess()`.
 *
 * Single async start() that grants a MIDIAccess; thereafter exposes:
 *   - inputs() / outputs() — current port lists.
 *   - setOnCC(cb) — fires for every incoming MIDI CC across every input.
 *   - setOnPortChange(cb) — fires when ports are connected/disconnected,
 *     so UI selectors can re-render.
 *
 * We don't filter by user-selected port at this layer — the source driver
 * registers a separate SignalBus source per (port, channel, cc) tuple, so
 * the user can route any port's CC into the matrix.
 *
 * Sysex disabled — we don't need it, and disabling reduces the permission
 * prompt friction in browsers that gate sysex behind an explicit grant.
 */

export type CCHandler = (
  portId: string,
  portName: string,
  channel: number,
  cc: number,
  value: number,
) => void;

export class MidiEngine {
  #access: MIDIAccess | null = null;
  #onCC: CCHandler | null = null;
  #onPortChange: (() => void) | null = null;

  /** True if Web MIDI is available (Chrome, Firefox 108+, Edge, Opera). */
  static isSupported(): boolean {
    return typeof navigator !== "undefined" && typeof navigator.requestMIDIAccess === "function";
  }

  /** Request MIDI permission and start listening. Must be called from a user gesture. */
  async start(): Promise<void> {
    if (!MidiEngine.isSupported()) {
      throw new Error("Web MIDI not supported in this browser");
    }
    this.#access = await navigator.requestMIDIAccess({ sysex: false });
    this.#access.onstatechange = () => {
      this.#wireInputs();
      this.#onPortChange?.();
    };
    this.#wireInputs();
  }

  /** Detach all listeners. Call on app teardown — rarely used. */
  stop(): void {
    if (!this.#access) return;
    for (const input of this.#access.inputs.values()) input.onmidimessage = null;
    this.#access.onstatechange = null;
    this.#access = null;
  }

  setOnCC(cb: CCHandler | null): void {
    this.#onCC = cb;
  }

  setOnPortChange(cb: (() => void) | null): void {
    this.#onPortChange = cb;
  }

  inputs(): MIDIInput[] {
    return this.#access ? Array.from(this.#access.inputs.values()) : [];
  }

  outputs(): MIDIOutput[] {
    return this.#access ? Array.from(this.#access.outputs.values()) : [];
  }

  // ─── Internals ────────────────────────────────────────────────────────────

  #wireInputs(): void {
    if (!this.#access) return;
    for (const input of this.#access.inputs.values()) {
      // statechange fires for every connect; reattach idempotently.
      input.onmidimessage = (e) => this.#handleMessage(input, e);
    }
  }

  #handleMessage(input: MIDIInput, e: MIDIMessageEvent): void {
    const data = e.data;
    if (!data || data.length < 3) return;
    const status = data[0]! & 0xf0;
    if (status !== 0xb0) return; // 0xB0 = Control Change
    const channel = (data[0]! & 0x0f) + 1;
    const cc = data[1]!;
    const value = data[2]!;
    this.#onCC?.(input.id, input.name ?? input.id, channel, cc, value);
  }
}
