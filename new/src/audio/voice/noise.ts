/**
 * NoiseVoice — example voice that demonstrates the AudioWorklet pattern.
 *
 * The pattern (any future custom-DSP voice should follow it):
 *
 *   1. Author the worklet in src/audio/worklets/<name>.worklet.ts —
 *      registerProcessor() at module level, math inside the process()
 *      method, no per-frame allocations.
 *
 *   2. Import the worklet URL with `?url` — Vite bundles the file and
 *      hands you the runtime URL string.
 *
 *   3. Implement a static async `prepareModule(context)` that calls
 *      `audioWorklet.addModule(url)`. Memoise so repeated calls are
 *      cheap (the AudioBinder may instantiate multiple voices of the
 *      same kind; we only register the module once per AudioContext).
 *
 *   4. The voice's tick() reads its sink slots and writes to the
 *      AudioWorkletNode's `parameters.get(name)` AudioParam, ramped
 *      via `linearRampToValueAtTime` so the audio thread sees a smooth
 *      curve. Same plan rule that BasicVoice follows.
 */

import * as Tone from "tone";
import type { SignalBus } from "../../signal/bus.ts";
import { bipolLin } from "../../signal/transform.ts";
import type { AudioEngine } from "../engine.ts";
import noiseWorkletUrl from "../worklets/noise.worklet.ts?url";
import { registerVoiceKind, type VoiceInstance } from "./registry.ts";

const PROCESSOR_NAME = "synestizer-noise";
const RAMP_S = 0.01;

// Memoised module load — one promise per AudioContext.
const loadedContexts = new WeakMap<BaseAudioContext, Promise<void>>();

async function ensureModule(context: BaseAudioContext): Promise<void> {
  let p = loadedContexts.get(context);
  if (!p) {
    p = context.audioWorklet.addModule(noiseWorkletUrl);
    loadedContexts.set(context, p);
  }
  return p;
}

export class NoiseVoice implements VoiceInstance {
  readonly id: string;
  readonly kind = "noise" as const;

  readonly #bus: SignalBus;
  readonly #node: AudioWorkletNode;
  readonly #gainNode: Tone.Gain;
  readonly #levelParam: AudioParam;

  readonly #levelSlot: number;
  readonly #gainSlot: number;

  /** Hook the AudioBinder calls before instantiation. Idempotent per ctx. */
  static async prepareModule(context: BaseAudioContext): Promise<void> {
    return ensureModule(context);
  }

  constructor(id: string, _params: Record<string, unknown>, bus: SignalBus, engine: AudioEngine) {
    this.id = id;
    this.#bus = bus;

    this.#levelSlot = bus.registerSink(`${id}.level`);
    this.#gainSlot = bus.registerSink(`${id}.gain`);

    const rawCtx = Tone.getContext().rawContext as BaseAudioContext;
    this.#node = new AudioWorkletNode(rawCtx, PROCESSOR_NAME, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    });
    const levelParam = this.#node.parameters.get("level");
    if (!levelParam) {
      throw new Error(`AudioWorklet "${PROCESSOR_NAME}" missing "level" parameter`);
    }
    this.#levelParam = levelParam;

    this.#gainNode = new Tone.Gain(0.3).connect(engine.masterInput);
    // Connect the raw worklet node into Tone's input — Tone wraps a real AudioNode.
    this.#node.connect(this.#gainNode.input);
  }

  tick(): void {
    const now = Tone.now();
    const levelBipol = this.#bus.readSink(this.#levelSlot);
    this.#levelParam.linearRampToValueAtTime(Math.max(0, bipolLin(0, 1, levelBipol)), now + RAMP_S);

    const gainBipol = this.#bus.readSink(this.#gainSlot);
    this.#gainNode.gain.linearRampTo(Math.max(0, bipolLin(0, 1, gainBipol)), RAMP_S, now);
  }

  dispose(): void {
    this.#node.disconnect();
    this.#gainNode.dispose();
  }
}

registerVoiceKind("noise", NoiseVoice);
