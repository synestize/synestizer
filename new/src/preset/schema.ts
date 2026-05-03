/**
 * Preset schema — synestizer/v1
 *
 * The preset *is* the ConfigStore. Two-stage routing graph:
 *   Stage 1: matrix entries (source → one of 8 generics) — copula combination per generic
 *   Stage 2: per-sink {signal, bias, scale} — applied as copula([bias, scale * signal])
 *
 * Sources are NOT in the preset — they're declared at runtime by engines.
 * Generics are NOT in the preset — they exist by construction (8 fixed slots).
 */

import { z } from "zod";

export const SCHEMA_VERSION = "synestizer/v1" as const;

export const GENERIC_COUNT = 8 as const;
export const GENERIC_LABELS = ["α", "β", "γ", "δ", "ε", "ζ", "η", "θ"] as const;

export type GenericIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** Combo-bus key for generic N (N = 0..7). */
export function genericComboKey(n: GenericIndex): string {
  return `generic.${n}`;
}

// ─── Sink kinds (Stage 3 onwards register more) ──────────────────────────────

export const SINK_KINDS = [
  "audio.param",
  "audio.gain",
  "audio.freq",
  "audio.detune",
  "midi.cc",
] as const;

export type SinkKind = (typeof SINK_KINDS)[number];

// ─── Voice kinds ─────────────────────────────────────────────────────────────

export const VOICE_KINDS = ["basic", "bubbleChamber"] as const;

export type VoiceKind = (typeof VOICE_KINDS)[number];

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const GenericIndexSchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
]);

const MatrixEntrySchema = z.object({
  source: z.string().min(1),
  generic: GenericIndexSchema,
  scale: z.number().min(-1).max(1),
});

const SinkSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(SINK_KINDS),
  label: z.string(),
  signal: z.string().nullable(),
  bias: z.number().min(-1).max(1),
  scale: z.number().min(-1).max(1),
  range: z.tuple([z.number(), z.number()]).optional(),
});

const VoiceSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(VOICE_KINDS),
  params: z.record(z.string(), z.unknown()),
});

const MasterSchema = z.object({
  gainDb: z.number().min(-120).max(12),
  muted: z.boolean(),
  tempoBpm: z.number().min(20).max(300),
});

const DevicesSchema = z.object({
  audioInputId: z.string().optional(),
  audioOutputId: z.string().optional(),
  midiInId: z.string().optional(),
  midiOutId: z.string().optional(),
});

const GuiSchema = z.object({
  visiblePane: z.string().optional(),
});

export const PresetSchema = z.object({
  $schema: z.literal(SCHEMA_VERSION),
  master: MasterSchema,
  matrix: z.array(MatrixEntrySchema),
  sinks: z.array(SinkSchema),
  voices: z.array(VoiceSchema),
  devices: DevicesSchema,
  gui: GuiSchema.optional(),
});

// ─── TS types derived from zod ───────────────────────────────────────────────

export type Preset = z.infer<typeof PresetSchema>;
export type MatrixEntry = z.infer<typeof MatrixEntrySchema>;
export type Sink = z.infer<typeof SinkSchema>;
export type Voice = z.infer<typeof VoiceSchema>;
export type Master = z.infer<typeof MasterSchema>;
export type Devices = z.infer<typeof DevicesSchema>;
