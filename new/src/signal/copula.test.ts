import { describe, expect, it } from "vitest";
import { copula } from "./copula.ts";

describe("copula", () => {
  it("copula([x]) ≈ x for small x", () => {
    for (const x of [0, 0.1, 0.5, -0.3, 0.9, -0.9]) {
      // saturate(desaturate(x)) ≈ x but not exact — small floating-point loss
      expect(copula([x])).toBeCloseTo(x, 2);
    }
  });

  it("copula([x, -x]) = 0 by symmetry", () => {
    for (const x of [0.1, 0.5, 0.9, -0.3]) {
      expect(copula([x, -x])).toBeCloseTo(0, 10);
    }
  });

  it("copula([0,...,0]) = 0", () => {
    expect(copula([0, 0, 0, 0])).toBeCloseTo(0, 10);
  });

  it("copula is bounded in [-1, 1]", () => {
    const big = [0.99, 0.99, 0.99, 0.99];
    const r = copula(big);
    expect(r).toBeGreaterThan(-1);
    expect(r).toBeLessThan(1);
  });
});
