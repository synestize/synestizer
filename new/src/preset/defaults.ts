import type { Preset } from "./schema.ts";
import { genericComboKey, SCHEMA_VERSION } from "./schema.ts";

/**
 * Empty preset — used by tests and as a starting point.
 * Real "playable" wiring is in `playablePreset()`.
 */
export function defaultPreset(): Preset {
  return {
    $schema: SCHEMA_VERSION,
    master: { gainDb: -12, muted: false, tempoBpm: 120 },
    matrix: [],
    sinks: [],
    voices: [],
    devices: {},
  };
}

/**
 * A non-trivial starting preset that maps camera input to audible motion:
 *   α (generic 0) ← brightness Y + a touch of red — drives loudness
 *   β (generic 1) ← blueness S — drives pitch
 *   γ (generic 2) ← motion ∆Y — drives detune jitter
 * Then a single basic voice with sinks reading α/β/γ.
 *
 * Bias and scale chosen so an "average" colour produces a pleasant centred
 * tone, and movement / colour shifts perturb it audibly.
 */
export function playablePreset(): Preset {
  return {
    $schema: SCHEMA_VERSION,
    master: { gainDb: -12, muted: false, tempoBpm: 120 },
    matrix: [
      // α (loudness): driven by overall brightness, with a small red contribution
      { source: "video.Y", generic: 0, scale: 0.9 },
      { source: "video.V", generic: 0, scale: 0.3 },
      // β (pitch): blue-yellow axis
      { source: "video.S", generic: 1, scale: 0.8 },
      // γ (detune): motion (∆ brightness)
      { source: "video.dY", generic: 2, scale: 0.7 },
    ],
    sinks: [
      {
        id: "v1.gain",
        kind: "audio.gain",
        label: "Gain",
        signal: genericComboKey(0),
        bias: -0.2,
        scale: 0.7,
      },
      {
        id: "v1.freq",
        kind: "audio.freq",
        label: "Freq",
        signal: genericComboKey(1),
        bias: -0.3,
        scale: 0.7,
      },
      {
        id: "v1.detune",
        kind: "audio.detune",
        label: "Detune",
        signal: genericComboKey(2),
        bias: 0,
        scale: 0.5,
      },
    ],
    voices: [{ id: "v1", kind: "basic", params: {} }],
    devices: {},
  };
}
