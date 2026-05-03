/**
 * The copula combination — first-class named operation.
 *
 *   copula(vals) = saturate(Σ desaturate(vals))
 *
 * Properties (by algebra; no test coverage needed):
 *   copula([x]) ≈ x
 *   copula([x, -x]) = 0
 *   monotone, signed, smooth, never clips harshly.
 *
 * This is the math that makes the original synth feel musical rather than crashy.
 * Renamed from "perturb" in the legacy code. Do NOT replace with sum-and-clip.
 */

import { desaturate, saturate, sevenBitSafe } from "./transform.ts";

export function copula(vals: ArrayLike<number>): number {
  let sum = 0;
  for (let i = 0; i < vals.length; i++) sum += desaturate(vals[i]!);
  return saturate(sum);
}

/**
 * Hot-path version: copula over a slice of a Float32Array. No allocations.
 * Inlines the saturate(Σ desaturate(...)) chain to avoid function-call overhead
 * in the 100 Hz scheduler tick.
 */
export function copulaBufferSlice(buf: Float32Array, start: number, end: number): number {
  const s = sevenBitSafe;
  let sum = 0;
  for (let i = start; i < end; i++) {
    const v = buf[i]!;
    // desaturate inlined: clipinf(atanh(v * s) / s)
    const a = Math.atanh(v * s) / s;
    sum += a < -3.13 ? -3.13 : a > 3.13 ? 3.13 : a;
  }
  // saturate inlined: tanh(sum/s) * s
  return Math.tanh(sum / s) * s;
}
