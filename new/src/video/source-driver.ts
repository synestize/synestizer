/**
 * Video source driver — main-thread loop that:
 *   1. Captures camera frames via requestVideoFrameCallback
 *   2. Scales them to 64×64 px via OffscreenCanvas, sends pixels to worker
 *   3. Receives 60-element stats Float32Array, writes to SignalBus source slots
 *
 * Sources are registered once on start(); the worker is created lazily.
 */

import type { SignalBus } from "../signal/bus.ts";
import type { CameraResult } from "./camera.ts";
import { MOMENT_COUNT, MOMENT_KEYS } from "./sources.ts";

const PIXEL_DIM = 64;

// ─── VideoWorker interface ────────────────────────────────────────────────────

interface FrameMessage {
  type: "frame";
  pixels: Uint8ClampedArray;
  timestamp: number;
}

interface StatsMessage {
  type: "stats";
  values: Float32Array;
}

// ─── VideoSourceDriver ────────────────────────────────────────────────────────

export class VideoSourceDriver {
  readonly #bus: SignalBus;
  readonly #sourceSlots: Int32Array; // slot indices for each MOMENT_KEY
  #worker: Worker | null = null;
  #canvas: OffscreenCanvas | null = null;
  #ctx: OffscreenCanvasRenderingContext2D | null = null;
  #camera: CameraResult | null = null;
  #stopped = false;
  #busy = false;

  constructor(bus: SignalBus) {
    this.#bus = bus;
    // Register all 60 source slots up front
    this.#sourceSlots = new Int32Array(MOMENT_COUNT);
    for (let i = 0; i < MOMENT_COUNT; i++) {
      this.#sourceSlots[i] = bus.registerSource(MOMENT_KEYS[i] as string);
    }
  }

  start(camera: CameraResult): void {
    this.#camera = camera;
    this.#stopped = false;

    // OffscreenCanvas to downscale frames
    this.#canvas = new OffscreenCanvas(PIXEL_DIM, PIXEL_DIM);
    this.#ctx = this.#canvas.getContext("2d", { willReadFrequently: true });

    // Spawn the stats worker
    this.#worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
    });
    this.#worker.addEventListener("message", (e: MessageEvent) => {
      this.#onStats((e.data as StatsMessage).values);
    });

    this.#scheduleNextFrame();
  }

  stop(): void {
    this.#stopped = true;
    this.#worker?.terminate();
    this.#worker = null;
    this.#camera?.stop();
    this.#camera = null;
  }

  #scheduleNextFrame(): void {
    if (this.#stopped) return;
    const videoEl = this.#camera?.videoEl;
    if (!videoEl) return;

    // Use requestVideoFrameCallback if available; fall back to rAF
    if ("requestVideoFrameCallback" in videoEl) {
      (
        videoEl as HTMLVideoElement & {
          requestVideoFrameCallback: (cb: (now: number) => void) => void;
        }
      ).requestVideoFrameCallback((ts) => this.#onFrame(ts));
    } else {
      requestAnimationFrame((ts) => this.#onFrame(ts));
    }
  }

  #onFrame(timestamp: number): void {
    if (this.#stopped || this.#busy) {
      this.#scheduleNextFrame();
      return;
    }
    const videoEl = this.#camera?.videoEl;
    const ctx = this.#ctx;
    const worker = this.#worker;
    if (!videoEl || !ctx || !worker) return;
    if (videoEl.readyState < 2) {
      // HAVE_CURRENT_DATA
      this.#scheduleNextFrame();
      return;
    }

    this.#busy = true;
    ctx.drawImage(videoEl, 0, 0, PIXEL_DIM, PIXEL_DIM);
    const imageData = ctx.getImageData(0, 0, PIXEL_DIM, PIXEL_DIM);

    const msg: FrameMessage = {
      type: "frame",
      pixels: imageData.data,
      timestamp,
    };
    worker.postMessage(msg, [imageData.data.buffer]);
    this.#scheduleNextFrame();
  }

  #onStats(values: Float32Array): void {
    this.#busy = false;
    for (let i = 0; i < MOMENT_COUNT && i < values.length; i++) {
      this.#bus.writeSource(this.#sourceSlots[i]!, values[i]!);
    }
  }
}
