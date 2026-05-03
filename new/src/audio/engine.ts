/**
 * AudioEngine — holds the Tone.js context, master bus, and lifecycle.
 *
 * Must be started from a user gesture (browser autoplay policy).
 */

import * as Tone from "tone";
import type { ConfigStore } from "../store/config-store.ts";

export class AudioEngine {
  readonly #masterGain: Tone.Gain;
  readonly #limiter: Tone.Limiter;
  readonly #configStore: ConfigStore;
  #unsubscribeGain: (() => void) | null = null;
  #unsubscribeMuted: (() => void) | null = null;

  constructor(configStore: ConfigStore) {
    this.#configStore = configStore;

    // Limiter at output (safety net — prevents clipping/ear damage)
    this.#limiter = new Tone.Limiter(-3).toDestination();
    // Master gain node
    this.#masterGain = new Tone.Gain(1).connect(this.#limiter);
  }

  /** Connect a node to the master bus. */
  get masterInput(): Tone.Gain {
    return this.#masterGain;
  }

  /**
   * Resume the AudioContext. Must be called from a user gesture.
   * Wires ConfigStore subscriptions once audio is running.
   */
  async start(): Promise<void> {
    await Tone.start();
    this.#wireConfig();
  }

  get started(): boolean {
    return Tone.getContext().state === "running";
  }

  dispose(): void {
    this.#unsubscribeGain?.();
    this.#unsubscribeMuted?.();
    this.#masterGain.dispose();
    this.#limiter.dispose();
  }

  #wireConfig(): void {
    const applyGain = () => {
      const gainDb = this.#configStore.get("master.gainDb");
      if (typeof gainDb === "number") {
        this.#masterGain.gain.rampTo(Tone.dbToGain(gainDb), 0.05);
      }
    };
    const applyMuted = () => {
      const muted = this.#configStore.get("master.muted");
      this.#masterGain.gain.rampTo(muted === true ? 0 : 1, 0.05);
    };

    this.#unsubscribeGain = this.#configStore.subscribe("master.gainDb", applyGain);
    this.#unsubscribeMuted = this.#configStore.subscribe("master.muted", applyMuted);
    applyGain();
  }
}
