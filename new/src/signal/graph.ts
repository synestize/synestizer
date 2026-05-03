/**
 * Compiled signal graph — flat numeric plan for the 100 Hz scheduler.
 *
 * Stage 1: matrix entries → 8 generics
 *   For each generic g, a list of (sourceSlot, scale) pairs.
 *   generics[g] = saturate(Σ scale_i * desaturate(sources[sourceSlot_i]))
 *
 *   NOTE (D-06 in devlog): we use `scale_i * desaturate(src)`, not
 *   `desaturate(scale_i * src)`. Matches the original signal.js exactly.
 *
 * Stage 2: per-sink {signal, bias, scale} → engineering value
 *   For each sink:
 *     val = copula([bias, scale * resolveCombo(signal)])
 *     eng = lo + (val + 1) * 0.5 * (hi - lo)   (when range present)
 *   Sinks with `signal === null` get `val = bias`.
 */

import type { Preset } from "../preset/schema.ts";
import { GENERIC_COUNT } from "../preset/schema.ts";
import type { SignalBus } from "./bus.ts";
import { sevenBitSafe } from "./transform.ts";

export interface Stage1Tuple {
  /** index into rawSources */
  sourceSlot: number;
  /** signed [-1, 1] */
  scale: number;
}

export interface Stage2Tuple {
  /** index into rawSinks (and rawSinkEng) — written here */
  sinkSlot: number;
  /** combo-bus pointer; null = unmodulated (val = bias) */
  signalArray: Float32Array | null;
  signalSlot: number;
  bias: number;
  scale: number;
  rangeLo: number;
  rangeHi: number;
  hasRange: boolean;
}

export interface CompiledGraph {
  /** stage1[g] = list of (sourceSlot, scale) for generic g */
  stage1: Stage1Tuple[][];
  stage2: Stage2Tuple[];
}

export function compileGraph(preset: Readonly<Preset>, bus: SignalBus): CompiledGraph {
  // Stage 1: bucket matrix entries by generic
  const stage1: Stage1Tuple[][] = [];
  for (let g = 0; g < GENERIC_COUNT; g++) stage1.push([]);

  for (const entry of preset.matrix) {
    const sourceSlot = bus.sourceSlot(entry.source);
    if (sourceSlot === undefined) continue; // dormant — referenced source not registered
    if (entry.scale === 0) continue;
    stage1[entry.generic]!.push({ sourceSlot, scale: entry.scale });
  }

  // Stage 2: resolve each sink's combo-bus pointer
  const stage2: Stage2Tuple[] = [];
  for (const sink of preset.sinks) {
    const sinkSlot = bus.sinkSlot(sink.id);
    if (sinkSlot === undefined) continue; // sink hasn't been registered by a voice yet
    let signalArray: Float32Array | null = null;
    let signalSlot = 0;
    if (sink.signal !== null) {
      const resolved = bus.resolveCombo(sink.signal);
      if (resolved !== null) {
        signalArray = resolved.array;
        signalSlot = resolved.slot;
      }
      // If unresolvable, fall through with signalArray=null (treat as unmodulated).
    }
    const range = sink.range;
    stage2.push({
      sinkSlot,
      signalArray,
      signalSlot,
      bias: sink.bias,
      scale: sink.scale,
      rangeLo: range ? range[0] : -1,
      rangeHi: range ? range[1] : 1,
      hasRange: range !== undefined,
    });
  }

  return { stage1, stage2 };
}

// ─── Hot-path execution (zero allocations per tick) ─────────────────────────

/** Run Stage 1: copula-combine source signals into the 8 generics. */
export function runStage1(graph: CompiledGraph, bus: SignalBus): void {
  const sources = bus.rawSources();
  const generics = bus.rawGenerics();
  const s = sevenBitSafe;

  for (let g = 0; g < GENERIC_COUNT; g++) {
    const tuples = graph.stage1[g]!;
    let sum = 0;
    for (let i = 0; i < tuples.length; i++) {
      const t = tuples[i]!;
      // scale * desaturate(source)
      const src = sources[t.sourceSlot]!;
      const a = Math.atanh(src * s) / s;
      const ad = a < -3.13 ? -3.13 : a > 3.13 ? 3.13 : a;
      sum += t.scale * ad;
    }
    // saturate(sum)
    generics[g] = Math.tanh(sum / s) * s;
  }
}

/** Run Stage 2: per-sink bias+scale+copula, then map through range. */
export function runStage2(graph: CompiledGraph, bus: SignalBus): void {
  const sinks = bus.rawSinks();
  const sinkEng = bus.rawSinkEng();
  const s = sevenBitSafe;
  const tuples = graph.stage2;

  for (let i = 0; i < tuples.length; i++) {
    const t = tuples[i]!;
    let val: number;
    if (t.signalArray === null) {
      val = t.bias;
    } else {
      const sig = t.signalArray[t.signalSlot]!;
      // copula([bias, scale * sig])
      const v0 = t.bias;
      const v1 = t.scale * sig;
      const a0 = Math.atanh(v0 * s) / s;
      const a1 = Math.atanh(v1 * s) / s;
      const ad0 = a0 < -3.13 ? -3.13 : a0 > 3.13 ? 3.13 : a0;
      const ad1 = a1 < -3.13 ? -3.13 : a1 > 3.13 ? 3.13 : a1;
      val = Math.tanh((ad0 + ad1) / s) * s;
    }
    sinks[t.sinkSlot] = val;
    if (t.hasRange) {
      sinkEng[t.sinkSlot] = t.rangeLo + (val + 1) * 0.5 * (t.rangeHi - t.rangeLo);
    } else {
      sinkEng[t.sinkSlot] = val;
    }
  }
}
