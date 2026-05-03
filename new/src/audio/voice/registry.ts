/**
 * Voice registry — maps VoiceKind strings to constructors.
 *
 * A voice:
 *   - On construction, registers its parameter sinks with the SignalBus.
 *   - On each signal tick, reads sink slots from SignalBus and pokes Tone params.
 *   - Exposes start()/stop() for manual trigger (Stage 3) and dispose().
 */

import type { VoiceKind } from "../../preset/schema.ts";
import type { SignalBus } from "../../signal/bus.ts";
import type { AudioEngine } from "../engine.ts";

export interface VoiceInstance {
  readonly id: string;
  readonly kind: VoiceKind;
  /** Called each signal tick (100 Hz). Write Tone param updates here. */
  tick(): void;
  dispose(): void;
}

export type VoiceConstructor = new (
  id: string,
  params: Record<string, unknown>,
  bus: SignalBus,
  engine: AudioEngine,
) => VoiceInstance;

const registry = new Map<VoiceKind, VoiceConstructor>();

export function registerVoiceKind(kind: VoiceKind, ctor: VoiceConstructor): void {
  registry.set(kind, ctor);
}

export function createVoice(
  kind: VoiceKind,
  id: string,
  params: Record<string, unknown>,
  bus: SignalBus,
  engine: AudioEngine,
): VoiceInstance {
  const Ctor = registry.get(kind);
  if (!Ctor) throw new Error(`Unknown voice kind: ${kind}`);
  return new Ctor(id, params, bus, engine);
}
