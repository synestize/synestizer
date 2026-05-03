import { describe, expect, it } from "vitest";
import { genericComboKey } from "../preset/schema.ts";
import { ConfigStore } from "../store/config-store.ts";
import { SignalBus } from "./bus.ts";
import { compileGraph, runStage1, runStage2 } from "./graph.ts";

describe("signal graph end-to-end", () => {
  it("Stage 1 + Stage 2 wiring with 2 sources, 2 generics, 2 sinks", () => {
    const store = new ConfigStore();
    const bus = new SignalBus();
    const sA = bus.registerSource("video.A");
    const sB = bus.registerSource("video.B");
    bus.registerSink("voice1.gain");
    bus.registerSink("voice1.freq");

    store.update((p) => {
      // Stage 1: A → generic 0 with scale 1, B → generic 1 with scale -0.5
      p.matrix.push({ source: "video.A", generic: 0, scale: 1 });
      p.matrix.push({ source: "video.B", generic: 1, scale: -0.5 });
      // Stage 2: gain reads generic 0 (bias 0, scale 1), freq reads source A directly (bias 0.2, scale 0.5)
      p.sinks.push({
        id: "voice1.gain",
        kind: "audio.gain",
        label: "Gain",
        signal: genericComboKey(0),
        bias: 0,
        scale: 1,
      });
      p.sinks.push({
        id: "voice1.freq",
        kind: "audio.freq",
        label: "Freq",
        signal: "video.A",
        bias: 0.2,
        scale: 0.5,
      });
    });

    const graph = compileGraph(store.snapshot(), bus);

    // Drive sources
    bus.writeSource(sA, 0.4);
    bus.writeSource(sB, 0.6);

    runStage1(graph, bus);
    runStage2(graph, bus);

    // generic 0 should be approximately 0.4 (single contributor with scale 1)
    expect(bus.readGeneric(0)).toBeCloseTo(0.4, 1);
    // generic 1 should be approximately -0.3 (B=0.6 with scale -0.5)
    expect(bus.readGeneric(1)).toBeCloseTo(-0.3, 1);
    // sinks should be in [-1, 1]
    expect(bus.readSink(0)).toBeGreaterThan(-1);
    expect(bus.readSink(0)).toBeLessThan(1);
    expect(bus.readSink(1)).toBeGreaterThan(-1);
    expect(bus.readSink(1)).toBeLessThan(1);
  });

  it("sink with signal=null gets val=bias", () => {
    const store = new ConfigStore();
    const bus = new SignalBus();
    bus.registerSink("v.x");
    store.update((p) => {
      p.sinks.push({
        id: "v.x",
        kind: "audio.param",
        label: "X",
        signal: null,
        bias: 0.42,
        scale: 0.7,
      });
    });
    const graph = compileGraph(store.snapshot(), bus);
    runStage2(graph, bus);
    expect(bus.readSink(0)).toBeCloseTo(0.42, 5);
  });

  it("dormant matrix entry (unregistered source) is silently dropped", () => {
    const store = new ConfigStore();
    const bus = new SignalBus();
    store.update((p) => {
      p.matrix.push({ source: "midi.in.0.cc.74", generic: 0, scale: 1 });
    });
    const graph = compileGraph(store.snapshot(), bus);
    expect(graph.stage1[0]).toEqual([]);
  });

  it("range-mapping maps [-1,1] → [lo, hi]", () => {
    const store = new ConfigStore();
    const bus = new SignalBus();
    bus.registerSink("v.f");
    store.update((p) => {
      p.sinks.push({
        id: "v.f",
        kind: "audio.freq",
        label: "F",
        signal: null,
        bias: 1, // → eng = hi
        scale: 0,
        range: [55, 3520],
      });
    });
    const graph = compileGraph(store.snapshot(), bus);
    runStage2(graph, bus);
    expect(bus.readSinkEng(0)).toBeCloseTo(3520, 1);
  });
});
