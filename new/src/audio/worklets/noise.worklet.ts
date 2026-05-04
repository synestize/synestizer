/**
 * AudioWorkletProcessor example — white noise with a level AudioParam.
 *
 * This file runs on the audio thread (NOT the main thread). Module-level
 * code is only the registerProcessor() call; everything else lives inside
 * the processor class.
 *
 * Build: Vite bundles this via `import noiseUrl from "./noise.worklet.ts?url"`
 * elsewhere — the resulting URL is what `audioWorklet.addModule()` consumes.
 *
 * Why a worklet for *this*: Tone.Noise already exists, so this is the
 * minimum-viable example, not a necessity. Stage 8+ voices that need
 * sample-accurate custom DSP (variable bit-crushing, granular synthesis,
 * physical modelling, etc.) follow the same pattern: extend
 * AudioWorkletProcessor, declare AudioParams in `parameterDescriptors`,
 * read inputs and write to outputs in `process()`. Don't allocate per
 * `process()` call.
 */

// AudioWorkletGlobalScope types — TS lib.dom.d.ts doesn't include them.
declare interface AudioParamDescriptor {
  name: string;
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  automationRate?: "a-rate" | "k-rate";
}
declare class AudioWorkletProcessor {
  static get parameterDescriptors(): AudioParamDescriptor[];
  process(
    inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ): boolean;
}
declare function registerProcessor(name: string, ctor: typeof AudioWorkletProcessor): void;

class NoiseProcessor extends AudioWorkletProcessor {
  static override get parameterDescriptors(): AudioParamDescriptor[] {
    return [
      {
        name: "level",
        defaultValue: 0.2,
        minValue: 0,
        maxValue: 1,
        // a-rate so the voice's per-sample modulation reaches the worklet
        // sample-accurately rather than being snapshot once per quantum.
        automationRate: "a-rate",
      },
    ];
  }

  override process(
    _inputs: Float32Array[][],
    outputs: Float32Array[][],
    parameters: Record<string, Float32Array>,
  ): boolean {
    const output = outputs[0];
    if (!output) return true;
    const level = parameters.level;
    if (!level) return true;

    for (let ch = 0; ch < output.length; ch++) {
      const channel = output[ch];
      if (!channel) continue;
      const levelIsConstant = level.length === 1;
      for (let i = 0; i < channel.length; i++) {
        const lvl = levelIsConstant ? level[0]! : level[i]!;
        // White noise in [-1, 1] scaled by level
        channel[i] = (Math.random() * 2 - 1) * lvl;
      }
    }
    return true;
  }
}

registerProcessor("synestizer-noise", NoiseProcessor);
