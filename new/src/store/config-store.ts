/**
 * ConfigStore — slow, persistent, JSON-serialisable user-edited config.
 *
 * The Preset *is* the ConfigStore's content. Edits go through `update()`
 * (Immer draft), which diffs paths and notifies subscribers.
 *
 * Iron rule: NO signal-rate values land here. Only user actions write.
 */

import { type Draft, freeze, produce } from "immer";
import { defaultPreset } from "../preset/defaults.ts";
import { parsePreset } from "../preset/migrate.ts";
import type { Preset } from "../preset/schema.ts";

export type ConfigCallback = (value: unknown, preset: Readonly<Preset>) => void;

interface Subscription {
  pathGlob: string;
  segments: string[];
  fn: ConfigCallback;
}

export class ConfigStore {
  #preset: Preset;
  readonly #subs = new Set<Subscription>();

  constructor(initial?: Preset) {
    this.#preset = freeze(initial ?? defaultPreset(), true);
  }

  /** Returns a frozen snapshot of the current preset. */
  snapshot(): Readonly<Preset> {
    return this.#preset;
  }

  /** Validate + replace the preset. Notifies all subscribers. */
  load(raw: unknown): void {
    const parsed = parsePreset(raw);
    const prev = this.#preset;
    this.#preset = freeze(parsed, true);
    this.#notifyAll(prev, this.#preset);
  }

  /**
   * Read a value by dot-path. Returns `unknown` — caller narrows.
   * Examples: "master.gainDb", "matrix.0.scale", "sinks".
   */
  get(path: string): unknown {
    return readPath(this.#preset, path.split("."));
  }

  /**
   * Mutate the preset via Immer draft. After the recipe runs:
   *   - new frozen preset is committed
   *   - changed paths computed
   *   - subscribers whose globs match any changed path are fired
   */
  update(recipe: (draft: Draft<Preset>) => void | Preset): void {
    const prev = this.#preset;
    const next = produce(prev, recipe);
    if (next === prev) return;
    this.#preset = freeze(next, true);
    const changed = diffPaths(prev as unknown, next as unknown, []);
    this.#notify(changed);
  }

  /**
   * Subscribe to changes at `pathGlob`. Glob supports:
   *   - "master.gainDb" — exact path
   *   - "matrix" — any change at or under matrix
   *   - "sinks.*.scale" — any sink's scale field
   *   - "**" — every change
   *
   * Returns an unsubscribe function.
   */
  subscribe(pathGlob: string, fn: ConfigCallback): () => void {
    const sub: Subscription = { pathGlob, segments: pathGlob.split("."), fn };
    this.#subs.add(sub);
    return () => {
      this.#subs.delete(sub);
    };
  }

  #notify(changed: string[]): void {
    for (const sub of this.#subs) {
      if (changed.some((p) => globMatches(sub.segments, p.split(".")))) {
        const value = readPath(
          this.#preset,
          sub.segments.filter((s) => s !== "*" && s !== "**"),
        );
        sub.fn(value, this.#preset);
      }
    }
  }

  #notifyAll(_prev: Readonly<Preset>, next: Readonly<Preset>): void {
    for (const sub of this.#subs) {
      const value = readPath(
        next,
        sub.segments.filter((s) => s !== "*" && s !== "**"),
      );
      sub.fn(value, next);
    }
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readPath(obj: unknown, segments: string[]): unknown {
  let cur: unknown = obj;
  for (const seg of segments) {
    if (cur === null || typeof cur !== "object") return undefined;
    if (Array.isArray(cur)) {
      const idx = Number(seg);
      if (!Number.isInteger(idx)) return undefined;
      cur = cur[idx];
    } else {
      cur = (cur as Record<string, unknown>)[seg];
    }
  }
  return cur;
}

/** Returns true if `glob` segments match `path` segments. `*` matches one segment, `**` matches any tail. */
function globMatches(glob: string[], path: string[]): boolean {
  let gi = 0;
  let pi = 0;
  while (gi < glob.length && pi < path.length) {
    const g = glob[gi]!;
    if (g === "**") return true;
    if (g === "*" || g === path[pi]) {
      gi++;
      pi++;
    } else {
      return false;
    }
  }
  // Either ran out of glob (matched prefix → still match: "matrix" matches "matrix.0.scale")
  // or ran out of path while glob still has segments (no match).
  if (gi === glob.length) return true;
  // Allow trailing "**"
  return glob[gi] === "**";
}

/** Returns dot-paths where `prev` and `next` differ. Recurses into objects + arrays. */
function diffPaths(prev: unknown, next: unknown, prefix: string[]): string[] {
  if (prev === next) return [];
  const out: string[] = [];
  const prevIsArray = Array.isArray(prev);
  const nextIsArray = Array.isArray(next);
  const prevIsObj = prev !== null && typeof prev === "object" && !prevIsArray;
  const nextIsObj = next !== null && typeof next === "object" && !nextIsArray;

  if (prevIsArray || nextIsArray) {
    const a = prevIsArray ? (prev as unknown[]) : [];
    const b = nextIsArray ? (next as unknown[]) : [];
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      out.push(...diffPaths(a[i], b[i], [...prefix, String(i)]));
    }
    if (a.length !== b.length) out.push(prefix.join("."));
    return out;
  }

  if (prevIsObj || nextIsObj) {
    const a = prevIsObj ? (prev as Record<string, unknown>) : {};
    const b = nextIsObj ? (next as Record<string, unknown>) : {};
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      out.push(...diffPaths(a[k], b[k], [...prefix, k]));
    }
    return out;
  }

  out.push(prefix.join("."));
  return out;
}
