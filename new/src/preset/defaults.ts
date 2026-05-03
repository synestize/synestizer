import type { Preset } from "./schema.ts";
import { SCHEMA_VERSION } from "./schema.ts";

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
