import { describe, expect, it } from "vitest";
import { defaultPreset } from "../preset/defaults.ts";
import { SCHEMA_VERSION } from "../preset/schema.ts";
import { ConfigStore } from "./config-store.ts";

describe("ConfigStore", () => {
  it("starts with default preset", () => {
    const store = new ConfigStore();
    const snap = store.snapshot();
    expect(snap.$schema).toBe(SCHEMA_VERSION);
    expect(snap.master.gainDb).toBe(-12);
  });

  it("update() mutates via Immer draft", () => {
    const store = new ConfigStore();
    store.update((p) => {
      p.master.gainDb = -6;
    });
    expect(store.snapshot().master.gainDb).toBe(-6);
  });

  it("get() reads dot-paths", () => {
    const store = new ConfigStore();
    expect(store.get("master.gainDb")).toBe(-12);
    expect(store.get("master.muted")).toBe(false);
    expect(store.get("nonexistent.path")).toBeUndefined();
  });

  it("subscribe() fires on exact-path change", () => {
    const store = new ConfigStore();
    let lastValue: unknown;
    const unsub = store.subscribe("master.gainDb", (v) => {
      lastValue = v;
    });
    store.update((p) => {
      p.master.gainDb = -3;
    });
    expect(lastValue).toBe(-3);
    unsub();
    store.update((p) => {
      p.master.gainDb = 0;
    });
    expect(lastValue).toBe(-3); // unsubscribed; no further updates
  });

  it("subscribe() does NOT fire on unrelated change", () => {
    const store = new ConfigStore();
    let calls = 0;
    store.subscribe("master.gainDb", () => {
      calls++;
    });
    store.update((p) => {
      p.master.muted = true;
    });
    expect(calls).toBe(0);
  });

  it("subscribe(prefix) fires on nested change", () => {
    const store = new ConfigStore();
    let calls = 0;
    store.subscribe("master", () => {
      calls++;
    });
    store.update((p) => {
      p.master.muted = true;
    });
    expect(calls).toBe(1);
  });

  it("subscribe(*) glob matches any direct child", () => {
    const store = new ConfigStore();
    let calls = 0;
    store.subscribe("matrix.*.scale", () => {
      calls++;
    });
    store.update((p) => {
      p.matrix.push({ source: "video.Y", generic: 0, scale: 0.5 });
    });
    expect(calls).toBeGreaterThanOrEqual(1);
  });

  it("load() validates and replaces", () => {
    const store = new ConfigStore();
    store.load(defaultPreset());
    expect(store.snapshot().$schema).toBe(SCHEMA_VERSION);
  });

  it("load() rejects bad schema version", () => {
    const store = new ConfigStore();
    expect(() => store.load({ ...defaultPreset(), $schema: "synestizer/v999" })).toThrow();
  });

  it("round-trips through JSON", () => {
    const store = new ConfigStore();
    store.update((p) => {
      p.master.gainDb = -3;
      p.matrix.push({ source: "video.Y", generic: 2, scale: 0.7 });
    });
    const json = JSON.stringify(store.snapshot());
    const reparsed = JSON.parse(json);
    const store2 = new ConfigStore();
    store2.load(reparsed);
    expect(store2.snapshot()).toEqual(store.snapshot());
  });
});
