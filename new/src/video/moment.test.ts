import { beforeEach, describe, expect, it } from "vitest";
import { computeMoments, MOMENT_BAND_OFFSETS, resetMomentState } from "./moment.ts";

const PIXELDIM = 64;
const PIXELCOUNT = PIXELDIM * PIXELDIM;

// ─── Helpers ────────────────────────────────────────────────────────────────

function makeUniform(rgb: [number, number, number]): Uint8ClampedArray {
  const buf = new Uint8ClampedArray(PIXELCOUNT * 4);
  for (let i = 0; i < PIXELCOUNT; i++) {
    const o = i * 4;
    buf[o] = rgb[0];
    buf[o + 1] = rgb[1];
    buf[o + 2] = rgb[2];
    buf[o + 3] = 255;
  }
  return buf;
}

/** Horizontal gradient: pixel (i, j) has RGB = (i*4, i*4, i*4). i runs 0..63. */
function makeGradientX(): Uint8ClampedArray {
  const buf = new Uint8ClampedArray(PIXELCOUNT * 4);
  for (let j = 0; j < PIXELDIM; j++) {
    for (let i = 0; i < PIXELDIM; i++) {
      const o = (PIXELDIM * j + i) * 4;
      const v = i * 4; // 0..252
      buf[o] = v;
      buf[o + 1] = v;
      buf[o + 2] = v;
      buf[o + 3] = 255;
    }
  }
  return buf;
}

const Y = 0;
const IY = 3;
const RAW = MOMENT_BAND_OFFSETS.raw;
const DELTA = MOMENT_BAND_OFFSETS.delta;

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("computeMoments", () => {
  beforeEach(() => {
    resetMomentState();
  });

  it("black frame → raw Y clips to -1 (luma far below the 0.4..0.6 sweet spot)", () => {
    const out = computeMoments(makeUniform([0, 0, 0]), 0);
    expect(out[RAW + Y]).toBeCloseTo(-1, 5);
  });

  it("white frame → raw Y clips to +1", () => {
    const out = computeMoments(makeUniform([255, 255, 255]), 0);
    expect(out[RAW + Y]).toBeCloseTo(1, 5);
  });

  it("mid-grey (128) → raw Y near zero (linBipol re-centres 0.4..0.6)", () => {
    // Y_pixel ≈ 0.00392 × 128 ≈ 0.502, linBipol(0.4, 0.6, 0.502) ≈ 0.02
    const out = computeMoments(makeUniform([128, 128, 128]), 0);
    expect(out[RAW + Y]).toBeGreaterThan(-0.1);
    expect(out[RAW + Y]).toBeLessThan(0.1);
  });

  it("horizontal brightness gradient → cooked IY strongly positive", () => {
    // Brightness rising with i means Y correlates with the i-axis; IY > 0.5
    // confirms the spatial-moment compute hasn't regressed.
    const out = computeMoments(makeGradientX(), 0);
    expect(out[RAW + IY]).toBeGreaterThan(0.5);
  });

  it("two identical frames → ∆Y ≈ 0", () => {
    const buf = makeUniform([128, 128, 128]);
    computeMoments(buf, 0);
    const out = computeMoments(buf, 33); // 33ms later
    expect(out[DELTA + Y]).toBeCloseTo(0, 5);
  });

  it("frame change (black → white) → ∆Y > 0 on the second frame", () => {
    computeMoments(makeUniform([0, 0, 0]), 0);
    const out = computeMoments(makeUniform([255, 255, 255]), 33);
    // ∆ is clipped to [-1, 1] but should be at the positive end
    expect(out[DELTA + Y]).toBeGreaterThan(0.5);
  });
});
