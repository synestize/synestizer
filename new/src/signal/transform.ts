/**
 * Math conversions ported verbatim from src/lib/transform.js.
 *
 * sevenBitSafe = 127.5 / 128 — this constant carries through the original
 * codebase and gives copula() its smooth saturation behavior. Don't change it.
 */

export const sevenBitSafe = 127.5 / 128;

/** Largest finite |val| for which `val * sevenBitSafe ∈ (-1, 1)`. */
export const maxSafe = Math.atanh(1.0 * sevenBitSafe) / sevenBitSafe;

/** [-∞, ∞] → [-1, 1]. Smooth, monotone, signed; near-linear near 0. */
export function saturate(val: number): number {
  return Math.tanh(val / sevenBitSafe) * sevenBitSafe;
}

/** [-1, 1] → [-∞, ∞]. Inverse of saturate; clipped to a finite range. */
export function desaturate(val: number): number {
  return clipinf(Math.atanh(val * sevenBitSafe) / sevenBitSafe);
}

export function identity<T>(x: T): T {
  return x;
}

export function clip(min: number, max: number, val: number): number {
  if (min > max) [min, max] = [max, min];
  return Math.min(Math.max(val, min), max);
}

export function clip1(val: number): number {
  return val < -1 ? -1 : val > 1 ? 1 : val;
}

export function clipinf(val: number): number {
  return val < -maxSafe ? -maxSafe : val > maxSafe ? maxSafe : val;
}

export function linBipol(min: number, max: number, val: number): number {
  const range = max - min;
  const middle = (max + min) / 2;
  return clip1(((val - middle) * 2) / range);
}

export function bipolLin(min: number, max: number, val: number): number {
  const range = max - min;
  const middle = (max + min) / 2;
  return clip(min, max, val * range * 0.5 + middle);
}

export function intBipol(min: number, max: number, val: number): number {
  const range = max - min;
  const middle = (max + min) / 2;
  return clip(min, max, ((val - middle) * 2) / range);
}

export function bipolInt(min: number, max: number, val: number): number {
  const range = max - min;
  const middle = (max + min) / 2;
  return clip(min, max, Math.round(val * range * 0.5 + middle));
}

export function midiBipol(val: number): number {
  return (val - 63.5) / 63.5;
}

export function bipolMidi(val: number): number {
  return Math.max(Math.min(Math.round(val * 63.5 + 63.5), 127), 0);
}

export function percBipol(val: number): number {
  return clip1((val - 50) / 50);
}

export function bipolPerc(val: number): number {
  return Math.max(Math.min(Math.round(val * 50 + 50), 100), 0);
}

export function bipolEquiOctave(min: number, max: number, val: number): number {
  const logmin = Math.log(min) / Math.LN2;
  const logmax = Math.log(max) / Math.LN2;
  return 2 ** bipolLin(logmin, logmax, val);
}
