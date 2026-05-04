/**
 * MidiSourceDriver — registers SignalBus sources lazily for incoming CCs.
 *
 * Source IDs follow the pattern `midi.in.<portId>.ch<N>.cc<M>` where:
 *   - portId   stable WebMIDI port id (varies by browser/OS)
 *   - N        MIDI channel 1–16
 *   - M        controller number 0–127
 *
 * Friendly label `<port-name> ch<N> CC<M>` is stored alongside via
 * SignalBus.registerSource(id, label) — the source picker and matrix
 * pick that up automatically.
 *
 * Lazy registration matters: a pad controller exposes ~120 CCs per
 * channel × 16 channels × multiple ports. Registering them up front
 * would clutter the picker. Only the ones the user has actually
 * touched land in the bus.
 */

import type { SignalBus } from "../signal/bus.ts";
import type { MidiEngine } from "./engine.ts";

const BIPOL_DENOM = 63.5;

export class MidiSourceDriver {
  readonly #bus: SignalBus;
  readonly #engine: MidiEngine;

  constructor(bus: SignalBus, engine: MidiEngine) {
    this.#bus = bus;
    this.#engine = engine;
  }

  start(): void {
    this.#engine.setOnCC((portId, portName, channel, cc, value) => {
      const id = `midi.in.${portId}.ch${channel}.cc${cc}`;
      const label = `${portName} ch${channel} CC${cc}`;
      // registerSource is idempotent and accepts a late label upgrade,
      // so we don't need to special-case the first-CC path.
      const slot = this.#bus.registerSource(id, label);
      // 0..127 → -1..1 with 63.5 centre, matches midiBipol() in transform.ts
      this.#bus.writeSource(slot, (value - BIPOL_DENOM) / BIPOL_DENOM);
    });
  }

  stop(): void {
    this.#engine.setOnCC(null);
  }
}
