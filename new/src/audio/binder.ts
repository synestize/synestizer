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

import type { SignalBus } from "../signal/bus.ts";
import { compileGraph } from "../signal/graph.ts";
import type { Scheduler } from "../signal/scheduler.ts";
import type { ConfigStore } from "../store/config-store.ts";
import type { AudioEngine } from "./engine.ts";
import { createVoice, type VoiceInstance } from "./voice/registry.ts";

export class AudioBinder {
  readonly #configStore: ConfigStore;
  readonly #bus: SignalBus;
  readonly #scheduler: Scheduler;
  readonly #engine: AudioEngine;

  #voices = new Map<string, VoiceInstance>();
  readonly #unsubs: Array<() => void> = [];

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

    // Create new voices
    for (const voiceConfig of wantedVoices) {
      if (!this.#voices.has(voiceConfig.id)) {
        const instance = createVoice(
          voiceConfig.kind,
          voiceConfig.id,
          voiceConfig.params as Record<string, unknown>,
          this.#bus,
          this.#engine,
        );
        this.#voices.set(voiceConfig.id, instance);
      }
    }

    // New sinks may have been registered by the new voices — recompile
    this.#recompileGraph();
  }

  #recompileGraph(): void {
    const graph = compileGraph(this.#configStore.snapshot(), this.#bus);
    this.#scheduler.setGraph(graph);
  }
}
