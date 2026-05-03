/**
 * Preset migration entry point.
 *
 * For v1, this is a thin wrapper: validate + reject unknown $schema versions.
 * Future migrations layer in here as we bump the version.
 */

import { type Preset, PresetSchema, SCHEMA_VERSION } from "./schema.ts";

export class PresetParseError extends Error {
  override readonly name = "PresetParseError";
  readonly detail?: unknown;
  constructor(message: string, detail?: unknown) {
    super(message);
    this.detail = detail;
  }
}

export function parsePreset(raw: unknown): Preset {
  if (typeof raw !== "object" || raw === null) {
    throw new PresetParseError("Preset must be an object");
  }
  const schemaField = (raw as { $schema?: unknown }).$schema;
  if (schemaField !== SCHEMA_VERSION) {
    throw new PresetParseError(
      `Unsupported preset schema "${String(schemaField)}"; expected "${SCHEMA_VERSION}"`,
    );
  }
  const result = PresetSchema.safeParse(raw);
  if (!result.success) {
    throw new PresetParseError("Preset failed validation", result.error);
  }
  return result.data;
}
