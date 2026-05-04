/**
 * AudioBinder — wires ConfigStore voice list to live VoiceInstance objects,
 * and keeps the Scheduler's compiled graph current.
 *
 * On start():
 *   - Subscribes to ConfigStore "voices", "matrix", "sinks" changes.
 *   - Creates/disposes VoiceInstances; recompiles the execution graph.
 *   - Subscribes to SignalBus frame callback; calls tick() on each voice.
 *
 * Importing this module registers all built-in voice kinds as a side effect.
 */

// Side-effect imports — register built-in voice kinds into the registry
import "./voice/basic.ts";
import "./voice/noise.ts";

import * as Tone from "tone";
import type { VoiceKind } from "../preset/schema.ts";
import type { SignalBus } from "../signal/bus.ts";
import { compileGraph } from "../signal/graph.ts";
import type { Scheduler } from "../signal/scheduler.ts";
import type { ConfigStore } from "../store/config-store.ts";
import type { AudioEngine } from "./engine.ts";
import { createVoice, getVoiceConstructor, type VoiceInstance } from "./voice/registry.ts";

export class AudioBinder {
  readonly #configStore: ConfigStore;
  readonly #bus: SignalBus;
  readonly #scheduler: Scheduler;
  readonly #engine: AudioEngine;

  #voices = new Map<string, VoiceInstance>();
  readonly #unsubs: Array<() => void> = [];
  // Voice kinds whose async prepareModule() has been run. Voices that depend
  // on AudioWorklet modules are skipped on the first sync pass and picked up
  // on the next pass triggered by store change after preparation completes.
  readonly #preparedKinds = new Set<VoiceKind>();
  readonly #preparingKinds = new Set<VoiceKind>();

  constructor(configStore: ConfigStore, bus: SignalBus, scheduler: Scheduler, engine: AudioEngine) {
    this.#configStore = configStore;
    this.#bus = bus;
    this.#scheduler = scheduler;
    this.#engine = engine;
  }

  start(): void {
    this.#unsubs.push(
      this.#configStore.subscribe("voices", () => this.#syncVoices()),
      this.#configStore.subscribe("matrix", () => this.#recompileGraph()),
      this.#configStore.subscribe("sinks", () => this.#recompileGraph()),
      this.#bus.subscribeFrame(() => {
        for (const voice of this.#voices.values()) voice.tick();
      }),
    );
    this.#syncVoices();
  }

  stop(): void {
    for (const unsub of this.#unsubs) unsub();
    this.#unsubs.length = 0;
    for (const voice of this.#voices.values()) voice.dispose();
    this.#voices.clear();
  }

  #syncVoices(): void {
    const wantedVoices = this.#configStore.snapshot().voices;
    const wantedIds = new Set(wantedVoices.map((v) => v.id));

    // Dispose voices no longer in config
    for (const [id, voice] of this.#voices) {
      if (!wantedIds.has(id)) {
        voice.dispose();
        this.#voices.delete(id);
      }
    }

    // Create new voices. Defer any whose voice kind has an unprepared
    // async prepareModule() — kick off the prep, retry on completion.
    for (const voiceConfig of wantedVoices) {
      if (this.#voices.has(voiceConfig.id)) continue;
      const Ctor = getVoiceConstructor(voiceConfig.kind);
      if (!Ctor) continue;
      if (Ctor.prepareModule && !this.#preparedKinds.has(voiceConfig.kind)) {
        this.#prepareKind(voiceConfig.kind, Ctor.prepareModule);
        continue;
      }
      const instance = createVoice(
        voiceConfig.kind,
        voiceConfig.id,
        voiceConfig.params as Record<string, unknown>,
        this.#bus,
        this.#engine,
      );
      this.#voices.set(voiceConfig.id, instance);
    }

    // New sinks may have been registered by the new voices — recompile
    this.#recompileGraph();
  }

  #prepareKind(kind: VoiceKind, prepare: (context: BaseAudioContext) => Promise<void>): void {
    if (this.#preparingKinds.has(kind)) return;
    this.#preparingKinds.add(kind);
    const ctx = Tone.getContext().rawContext as BaseAudioContext;
    prepare(ctx)
      .then(() => {
        this.#preparedKinds.add(kind);
        this.#preparingKinds.delete(kind);
        // Re-run sync so any deferred voices of this kind get instantiated.
        this.#syncVoices();
      })
      .catch((err) => {
        this.#preparingKinds.delete(kind);
        console.error(`[audio/binder] prepareModule failed for "${kind}":`, err);
      });
  }

  #recompileGraph(): void {
    const graph = compileGraph(this.#configStore.snapshot(), this.#bus);
    this.#scheduler.setGraph(graph);
  }
}
