/*
 * mathematics
 */

export const mod = (a, b) => {
  // actual modulo operation, as opposed to hateful javascript fail
  return ((a % b) + b) % b
}

export const wrap = (min, max, val) => {
  return mod(val-min, max-min) + min
}
