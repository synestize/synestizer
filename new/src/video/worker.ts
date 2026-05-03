/**
 * Video stats worker — runs off the main thread.
 *
 * Message protocol:
 *   → { type: "frame", pixels: Uint8ClampedArray, width: number, height: number, timestamp: number }
 *   ← { type: "stats", values: Float32Array }   (transferred, not copied)
 *
 * Computes the 60-element Moment() feature vector per frame.
 * Algorithm ported verbatim from src/io/video/statModels.js (Moment).
 */

// ─── Moment feature extractor ─────────────────────────────────────────────────

// Slot indices matching the order in sources.ts MOMENT_KEYS
const PIXELDIM = 64;
const PIXELCOUNT = PIXELDIM * PIXELDIM;

// clamp to [-1,1]
function clip1(v: number): number {
  return v < -1 ? -1 : v > 1 ? 1 : v;
}
// sevenBitSafe constant
const s = 127.5 / 128;
function saturate(v: number): number {
  return Math.tanh(v / s) * s;
}
function linBipol(min: number, max: number, val: number): number {
  const range = max - min;
  const middle = (max + min) / 2;
  const r = ((val - middle) * 2) / range;
  return r < -1 ? -1 : r > 1 ? 1 : r;
}

// Slot indices
const Y = 0,
  S = 1,
  V = 2;
const IY = 3,
  IS = 4,
  IV = 5;
const JY = 6,
  JS = 7,
  JV = 8;
const YY = 9,
  YS = 10,
  YV = 11,
  SS = 12,
  SV = 13,
  VV = 14;

const rawSums = new Float32Array(15);
const centralMoments = new Float32Array(15);
const cookedMoments = new Float32Array(15);
const prevCookedMoments = new Float32Array(15);
const cookedDeltaMoments = new Float32Array(60);
const ysvij = new Float32Array(5);
let lastTime = 0;
let firstFrame = true;

function computeMoments(pixels: Uint8ClampedArray, timestamp: number): Float32Array {
  // Clear accumulators
  rawSums.fill(0);

  for (let j = 0; j < PIXELDIM; j++) {
    for (let i = 0; i < PIXELDIM; i++) {
      const ij = (PIXELDIM * j + i) * 4; // pixel offset in RGBA
      // Transform RGB → YSV (PCA-style colour space from original)
      ysvij[0] =
        0.00117255 * pixels[ij]! + 0.002302 * pixels[ij + 1]! + 0.00044706 * pixels[ij + 2]!;
      ysvij[1] =
        0.5 +
        (-0.00066563 * pixels[ij]! - 0.00129907 * pixels[ij + 1]! + 0.00196078 * pixels[ij + 2]!);
      ysvij[2] =
        0.5 +
        (0.00196078 * pixels[ij]! - 0.00164191 * pixels[ij + 1]! - 0.00031887 * pixels[ij + 2]!);
      ysvij[3] = i / PIXELDIM; // I axis
      ysvij[4] = j / PIXELDIM; // J axis

      const v0 = ysvij[0]!;
      const v1 = ysvij[1]!;
      const v2 = ysvij[2]!;
      const v3 = ysvij[3]!;
      const v4 = ysvij[4]!;
      rawSums[Y] = rawSums[Y]! + v0;
      rawSums[S] = rawSums[S]! + v1;
      rawSums[V] = rawSums[V]! + v2;
      rawSums[IY] = rawSums[IY]! + v0 * v3;
      rawSums[IS] = rawSums[IS]! + v1 * v3;
      rawSums[IV] = rawSums[IV]! + v2 * v3;
      rawSums[JY] = rawSums[JY]! + v0 * v4;
      rawSums[JS] = rawSums[JS]! + v1 * v4;
      rawSums[JV] = rawSums[JV]! + v2 * v4;
      rawSums[YY] = rawSums[YY]! + v0 * v0;
      rawSums[YS] = rawSums[YS]! + v0 * v1;
      rawSums[YV] = rawSums[YV]! + v0 * v2;
      rawSums[SS] = rawSums[SS]! + v1 * v1;
      rawSums[SV] = rawSums[SV]! + v1 * v2;
      rawSums[VV] = rawSums[VV]! + v2 * v2;
    }
  }

  // Central moments
  centralMoments[Y] = rawSums[Y]! / PIXELCOUNT;
  centralMoments[S] = rawSums[S]! / PIXELCOUNT;
  centralMoments[V] = rawSums[V]! / PIXELCOUNT;
  centralMoments[YY] = rawSums[YY]! / PIXELCOUNT - centralMoments[Y]! * centralMoments[Y]!;
  centralMoments[SS] = rawSums[SS]! / PIXELCOUNT - centralMoments[S]! * centralMoments[S]!;
  centralMoments[VV] = rawSums[VV]! / PIXELCOUNT - centralMoments[V]! * centralMoments[V]!;
  centralMoments[IY] = rawSums[IY]! / PIXELCOUNT - 0.5 * centralMoments[Y]!;
  centralMoments[IS] = rawSums[IS]! / PIXELCOUNT - 0.5 * centralMoments[S]!;
  centralMoments[IV] = rawSums[IV]! / PIXELCOUNT - 0.5 * centralMoments[V]!;
  centralMoments[JY] = rawSums[JY]! / PIXELCOUNT - 0.5 * centralMoments[Y]!;
  centralMoments[JS] = rawSums[JS]! / PIXELCOUNT - 0.5 * centralMoments[S]!;
  centralMoments[JV] = rawSums[JV]! / PIXELCOUNT - 0.5 * centralMoments[V]!;
  centralMoments[YS] = rawSums[YS]! / PIXELCOUNT - centralMoments[Y]! * centralMoments[S]!;
  centralMoments[YV] = rawSums[YV]! / PIXELCOUNT - centralMoments[Y]! * centralMoments[V]!;
  centralMoments[SV] = rawSums[SV]! / PIXELCOUNT - centralMoments[S]! * centralMoments[V]!;

  // Cooked (scaled + normalised to [-1,1])
  cookedMoments[Y] = linBipol(0.4, 0.6, centralMoments[Y]!);
  cookedMoments[S] = linBipol(0.4, 0.6, centralMoments[S]!);
  cookedMoments[V] = linBipol(0.4, 0.6, centralMoments[V]!);
  cookedMoments[YY] = linBipol(-0.05, 0.05, centralMoments[YY]!);
  cookedMoments[SS] = linBipol(-0.05, 0.05, centralMoments[SS]!);
  cookedMoments[VV] = linBipol(-0.05, 0.05, centralMoments[VV]!);
  cookedMoments[YS] = clip1(
    centralMoments[YS]! / Math.max(0.0001, Math.sqrt(centralMoments[YY]! * centralMoments[SS]!)),
  );
  cookedMoments[YV] = clip1(
    centralMoments[YV]! / Math.max(0.0001, Math.sqrt(centralMoments[YY]! * centralMoments[VV]!)),
  );
  cookedMoments[SV] = clip1(
    centralMoments[SV]! / Math.max(0.0001, Math.sqrt(centralMoments[SS]! * centralMoments[VV]!)),
  );
  cookedMoments[IY] = clip1(
    centralMoments[IY]! / Math.max(0.0001, Math.sqrt(0.08333333 * centralMoments[YY]!)),
  );
  cookedMoments[IS] = clip1(
    centralMoments[IS]! / Math.max(0.0001, Math.sqrt(0.08333333 * centralMoments[SS]!)),
  );
  cookedMoments[IV] = clip1(
    centralMoments[IV]! / Math.max(0.0001, Math.sqrt(0.08333333 * centralMoments[VV]!)),
  );
  cookedMoments[JY] = clip1(
    centralMoments[JY]! / Math.max(0.0001, Math.sqrt(0.08333333 * centralMoments[YY]!)),
  );
  cookedMoments[JS] = clip1(
    centralMoments[JS]! / Math.max(0.0001, Math.sqrt(0.08333333 * centralMoments[SS]!)),
  );
  cookedMoments[JV] = clip1(
    centralMoments[JV]! / Math.max(0.0001, Math.sqrt(0.08333333 * centralMoments[VV]!)),
  );

  // Temporal: delta, (delta)², integral
  const thisTime = timestamp;
  const deltaTimeS = firstFrame ? 0.033 : Math.max(0.001, (thisTime - lastTime) / 1000);
  firstFrame = false;

  for (let i = 0; i < 15; i++) {
    const curr = cookedMoments[i]!;
    const prev = prevCookedMoments[i]!;
    const delta = clip1((0.125 * (curr - prev)) / deltaTimeS);
    cookedDeltaMoments[i] = curr; // raw
    cookedDeltaMoments[i + 15] = delta; // ∆
    cookedDeltaMoments[i + 30] = 2 * delta * delta - 1; // (∆)²
    cookedDeltaMoments[i + 45] = saturate(
      // ∫
      cookedDeltaMoments[i + 45]! + curr * deltaTimeS * 0.125,
    );
  }

  lastTime = thisTime;
  for (let i = 0; i < 15; i++) prevCookedMoments[i] = cookedMoments[i]!;

  return cookedDeltaMoments;
}

// ─── Worker message handler ───────────────────────────────────────────────────

// We receive the rescaled 64×64 pixel strip
self.addEventListener("message", (e: MessageEvent) => {
  const { type, pixels, timestamp } = e.data as {
    type: string;
    pixels: Uint8ClampedArray;
    timestamp: number;
  };
  if (type !== "frame") return;

  const values = computeMoments(pixels, timestamp);
  // Transfer the buffer to avoid copying
  const copy = new Float32Array(values);
  self.postMessage({ type: "stats", values: copy }, [copy.buffer]);
});
