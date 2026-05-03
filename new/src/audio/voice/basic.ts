/**
 * BasicVoice — a continuous sine oscillator with freq/gain/detune sinks.
 *
 * The simplest voice: always running, driven entirely by SignalBus sinks.
 * Param writes use linearRampTo (~10ms) to eliminate zipper noise per plan rule.
 */

import * as Tone from "tone";
import type { SignalBus } from "../../signal/bus.ts";
import { bipolEquiOctave, bipolLin } from "../../signal/transform.ts";
import type { AudioEngine } from "../engine.ts";
import { registerVoiceKind, type VoiceInstance } from "./registry.ts";

// Engineering ranges for the three sinks
const FREQ_MIN = 55; // A1
const FREQ_MAX = 3520; // A7 (6 octaves of range)
const DETUNE_MIN = -1200;
const DETUNE_MAX = 1200; // ±1 octave in cents
const RAMP_S = 0.01; // 10 ms ramp — eliminates zipper noise as a class

export class BasicVoice implements VoiceInstance {
  readonly id: string;
  readonly kind = "basic" as const;

  readonly #bus: SignalBus;
  readonly #osc: Tone.Oscillator;
  readonly #gainNode: Tone.Gain;

  readonly #freqSlot: number;
  readonly #gainSlot: number;
  readonly #detuneSlot: number;

  constructor(id: string, _params: Record<string, unknown>, bus: SignalBus, engine: AudioEngine) {
    this.id = id;
    this.#bus = bus;

    this.#freqSlot = bus.registerSink(`${id}.freq`);
    this.#gainSlot = bus.registerSink(`${id}.gain`);
    this.#detuneSlot = bus.registerSink(`${id}.detune`);

    this.#gainNode = new Tone.Gain(0.3).connect(engine.masterInput);
    this.#osc = new Tone.Oscillator({
      type: "sine",
      frequency: 440,
    }).connect(this.#gainNode);
    this.#osc.start();
  }

  /** Called each signal tick (100 Hz). All param writes are ramped. */
  tick(): void {
    const now = Tone.now();

    // freq: [-1,1] → [FREQ_MIN, FREQ_MAX] equal-octave
    const freqBipol = this.#bus.readSink(this.#freqSlot);
    this.#osc.frequency.linearRampTo(bipolEquiOctave(FREQ_MIN, FREQ_MAX, freqBipol), RAMP_S, now);

    // gain: [-1,1] → [0, 1] linear
    const gainBipol = this.#bus.readSink(this.#gainSlot);
    this.#gainNode.gain.linearRampTo(Math.max(0, bipolLin(0, 1, gainBipol)), RAMP_S, now);

    // detune: [-1,1] → [DETUNE_MIN, DETUNE_MAX] cents
    const detuneBipol = this.#bus.readSink(this.#detuneSlot);
    this.#osc.detune.linearRampTo(bipolLin(DETUNE_MIN, DETUNE_MAX, detuneBipol), RAMP_S, now);
  }

  dispose(): void {
    this.#osc.stop();
    this.#osc.dispose();
    this.#gainNode.dispose();
  }
}

// Side-effect registration — import this module to register the voice kind.
registerVoiceKind("basic", BasicVoice);
