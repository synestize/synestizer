/**
 * Scheduler — fixed-rate (default 100 Hz) tick on the main thread.
 *
 * Per tick:
 *   1. Run Stage 1 (sources → generics)
 *   2. Run Stage 2 (combo bus → sink values + engineering units)
 *   3. Emit frame callback (voices read sinkEng and update Tone params)
 *
 * Lives on the main thread because Tone.Signal writes must come from main and
 * worker round-trips would only add latency.
 */

import type { SignalBus } from "./bus.ts";
import { type CompiledGraph, runStage1, runStage2 } from "./graph.ts";

export class Scheduler {
  readonly #bus: SignalBus;
  #graph: CompiledGraph = { stage1: [], stage2: [] };
  #intervalMs: number;
  #handle: ReturnType<typeof setInterval> | null = null;

  constructor(bus: SignalBus, hz = 100) {
    this.#bus = bus;
    this.#intervalMs = 1000 / hz;
    // Stage1 always has 8 generic slots
    this.#graph = { stage1: Array.from({ length: 8 }, () => []), stage2: [] };
  }

  setGraph(graph: CompiledGraph): void {
    this.#graph = graph;
  }

  start(): void {
    if (this.#handle !== null) return;
    this.#handle = setInterval(() => this.tick(), this.#intervalMs);
  }

  stop(): void {
    if (this.#handle !== null) {
      clearInterval(this.#handle);
      this.#handle = null;
    }
  }

  /** Public tick — exposed for tests and manual stepping. */
  tick(): void {
    runStage1(this.#graph, this.#bus);
    runStage2(this.#graph, this.#bus);
    this.#bus.emitFrame();
  }
}
