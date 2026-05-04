/**
 * Video stats worker — runs off the main thread.
 *
 * Message protocol:
 *   → { type: "frame", pixels: Uint8ClampedArray, timestamp: number }
 *   ← { type: "stats", values: Float32Array }   (transferred, not copied)
 *
 * The actual Moment() math lives in ./moment.ts so it can be unit-tested.
 */

import { computeMoments } from "./moment.ts";

self.addEventListener("message", (e: MessageEvent) => {
  const { type, pixels, timestamp } = e.data as {
    type: string;
    pixels: Uint8ClampedArray;
    timestamp: number;
  };
  if (type !== "frame") return;

  const values = computeMoments(pixels, timestamp);
  // Transfer the buffer to avoid copying. computeMoments returns a reused
  // internal buffer, so copy out before transferring.
  const copy = new Float32Array(values);
  self.postMessage({ type: "stats", values: copy }, [copy.buffer]);
});
