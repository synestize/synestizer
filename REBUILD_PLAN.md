# Synestizer rewrite — staged plan

## Context

Synestizer (~6,800 LOC) is a 2016-era React 15 + Redux 3 + Webpack 1 + Babel 6 + RxJS 5 + Tone.js web app that maps live camera input to audio synthesis ("hear color"). Toolchain is end-of-life, browser compat is broken in Firefox, and the architecture leaks 100 Hz signal data through Redux into ~100 SVG controls causing a redraw storm. We're starting clean.

**Decisions locked in (from scoping conversation):**
- Comprehensive rebuild, staged iteratively. Each stage ends with a working app. Broad trajectory + detailed early stages.
- **Audio engine:** Modern Tone.js v15 + AudioWorklet escape hatches.
- **UI stack:** Plain TypeScript + Web Components, **rendering SVG internally with direct DOM mutation** (not framework re-renders) for live indicators. Canvas reserved for camera preview, scope/spectrum, and "if matrix gets very large" deferral.
- **Presets:** Clean break — no back-compat with existing JSON. But schema designed *early* because preset shape strongly constrains the data model.
- **Tooling:** Vite + TS strict + Biome + Vitest. PWA via `vite-plugin-pwa`.

**Key invariants we MUST preserve from the original (these came up in review):**
1. **Copula combination is the named operation.** `copula(vals) = saturate(Σ desaturate(vals))` — not "saturated addition", not "projection". This is from [src/lib/transform.js:30-33](src/lib/transform.js) (`perturb`). Treat this as a first-class module with named identities (`copula([x]) = x`, `copula([x, -x]) = 0`, monotone, smooth, signed) and unit-tested.
2. **Two-stage signal graph with eight greek-letter generics.** Sources (video/MIDI) → patch matrix (copula combination per generic) → α β γ δ ε ζ η θ (fixed eight, hard-coded names) → "combo bus" (= sources ∪ generics) → audio param sinks (bias + scale per sink, single combo-bus selector). Without generics the user has to fully connect a 30×30 matrix; with them, complex routings stay tractable. Eight is fixed for v1 — not configurable, not renameable.
3. **Sinks are bias + scale + selected-signal, not "a number".** Each audio param sink reads one signal from the combo bus and applies signed bias (rest value) + signed scale (modulation depth). The widget visualises both knobs *and* the live perturbed value *and* the perturbation envelope — see [ArchimedeanSliderSVG.js](src/components/ArchimedeanSliderSVG.js).
4. **Matrix cells are animated, not painted.** Each matrix cell is signed scale + a live "shadow arrow" showing the per-cell perturbation contribution — see [ScaleSliderSVG.js](src/components/ScaleSliderSVG.js). They mutate every animation frame.

## The Big Idea: two-tier state, never mixed

The fundamental architectural mistake of the original app is that 100 Hz signal data lives in the same Redux store as user-edited config, and React containers subscribe to slices of that store. The rebuild has **two strictly separated tiers**:

```
┌─────────────────────────────────────────────────────────────────┐
│ ConfigStore (slow, persistent, JSON-serialisable, == preset)   │
│ - matrix scales, source/sink registries, voice params,         │
│   device selections, master settings, GUI state                │
│ - written by UI, read by audio/video/midi engines              │
│ - emits change events; static-shape Web Components subscribe   │
└─────────────────────────────────────────────────────────────────┘
                               ↕ (single direction per field)
┌─────────────────────────────────────────────────────────────────┐
│ SignalBus (fast, ephemeral, typed, never persisted)            │
│ - Float32Array of source values, Float32Array of sink values   │
│ - written at video/MIDI rate (~50–100 Hz), read by audio + UI  │
│ - meters/scope on Canvas subscribe via rAF, NOT via store      │
└─────────────────────────────────────────────────────────────────┘
```

**Iron rule:** no audio-rate or control-rate signal value ever lands in the ConfigStore. If a meter needs to display a value, it reads it from the SignalBus on its own rAF loop. ConfigStore changes are user actions only.

The `ConfigStore` snapshot **is** the preset. There's no separate serialisation layer to maintain.

## Concurrency model: four clocks, one shared buffer

The app has four independent clocks, none of which directly drives the others. Each writes to or reads from the SignalBus and lets the next clock sample whatever's there.

| Clock | Rate | Thread | Source |
|---|---|---|---|
| Audio render | 48 kHz | Audio thread | Hardware AudioContext |
| Audio scheduler (Tone.Transport) | ~10–50 Hz lookahead | Audio thread | Tone-managed |
| Video frame | ~30 Hz | Main → Web Worker | Camera (`requestVideoFrameCallback`) |
| Control loop (copula) | 100 Hz | Main | `setInterval` |
| UI repaint | 60 Hz | Main | `requestAnimationFrame` |
| User input | irregular | Main | Pointer/MIDI events |

**Coding rules to prevent glitches (these are the load-bearing decisions):**

1. **Audio param writes are always ramped.** Never `signal.value = x`; always `signal.linearRampTo(x, ~10ms)`. The audio engine's binder enforces this for every sink so voice authors can't bypass it. Eliminates zipper-noise as a class.
2. **The 100 Hz control loop runs on the main thread.** Don't move it to a worker — the SignalBus and ConfigStore live on main, and `Tone.Signal` writes have to come from main. Worker round-trips would just add latency without buying anything.
3. **Video stats stay in a Web Worker.** Use `OffscreenCanvas` + `requestVideoFrameCallback` where available; transfer Float32Array buffers back rather than copying. Worker reuses one stats buffer per frame; no per-frame allocations.
4. **Custom DSP, when needed, lives in AudioWorklet.** Stage 8+ escape hatch. Don't preemptively port Tone built-ins (Sampler, MonoSynth, FeedbackDelay, Loop) — they already run on the audio thread inside Tone's UMD nodes.
5. **UI samples, never receives push.** Web Components register one rAF callback in `connectedCallback`; in it they read SignalBus values and mutate 1–2 SVG attributes. The SignalBus exposes only `subscribeFrame(cb)` for engines that need per-tick coordination — no "subscribe per change" on the hot arrays.
6. **Zero allocations per frame in the hot path.** Coding norm, not a tested gate. Reuse `Float32Array`s, no spreads or `Object.assign` in the scheduler tick.
7. **Service Worker is offline-cache only.** It is *not* part of any data flow. Stage 9 only.

**What this rules out:** synchronous coupling between a video frame and an audio sample. Round-trip is ~10 ms (worker postMessage + scheduler + audio lookahead) — below most onset-perception thresholds but not sample-accurate. The original app modulated continuous params, not triggered events on video frames; this design preserves that and explicitly defers tight event coupling to a future "schedule by absolute audio timestamp" feature if it's ever needed.

## Preset schema (designed first, because everything else depends on it)

The preset captures the two-stage routing graph. **Stage 1** is the copula matrix mapping primary sources into greek-letter generic intermediates. **Stage 2** is the per-sink bias/scale/signal-pick that drives each audio param.

```ts
// synestizer/v1
type Preset = {
  $schema: "synestizer/v1";
  master: { gainDb: number; muted: boolean; tempoBpm: number };

  // === Primary sources: declared by engines at runtime, NOT stored here. ===
  // Video engine registers e.g. "video.bright", "video.deltaRed", per src/io/video/statModels.js Moment().
  // MIDI engine registers "midi.in.<port>.cc.<n>" as user adds them.
  // The preset references these by stable ID; if a referenced source isn't present
  // at load time (no MIDI device, etc.), the matrix entry is dormant but kept.

  // === Generic intermediates: fixed at 8, named α β γ δ ε ζ η θ. ===
  // Not in the preset — they exist by construction. The combo bus always has 8 generic slots.
  // Names come from a hard-coded const ['α','β','γ','δ','ε','ζ','η','θ'].

  // === Stage 1: patch matrix — primary sources → one of the 8 generics. ===
  // Sparse: only non-zero entries are stored. Each generic's value is
  // copula(matrix entries targeting it) at signal rate. `generic` is 0..7.
  matrix: Array<{ source: string; generic: 0|1|2|3|4|5|6|7; scale: number /* signed [-1, 1] */ }>;

  // === Stage 2: sinks (audio params + outbound MIDI CC). ===
  // Each sink picks ONE signal from the combo bus (= sources ∪ generics)
  // and applies signed bias + signed scale: actualValue = copula([bias, scale * signal]).
  sinks: Array<{
    id: string;                                     // e.g. "voice.bass.cutoff", "midi.out.0.cc.74"
    kind: SinkKind;
    label: string;
    signal: string | null;                          // combo-bus key, or null = unmodulated
    bias: number;                                   // signed [-1, 1] — rest value
    scale: number;                                  // signed [-1, 1] — modulation depth
    range?: [number, number];                       // engineering range (per kind default if absent)
  }>;

  // === Voices: instantiate sinks. ===
  // A voice declares the sinks it owns; removing a voice removes its sinks.
  voices: Array<{ id: string; kind: VoiceKind; params: Record<string, JsonValue> }>;

  // === Device selections. Opaque IDs; may not resolve on different machines. ===
  devices: { audioInputId?: string; audioOutputId?: string; midiInId?: string; midiOutId?: string };

  gui?: { visiblePane?: string };
};
```

Why this shape:
- **Two-stage graph is explicit.** Stage 1 (`matrix`) is many-to-one copula combination per generic. Stage 2 (`sinks[]`) is one-signal-per-sink with bias + scale. The "combo bus" is virtual: it's the union of the registered sources and the 8 fixed generics, and is what the sink-`signal` field references. Generic combo-keys are stable strings: `"generic.0"` … `"generic.7"` (displayed as α … θ).
- **Fixed-size generics.** Eight is plenty for typical patches and means the schema, the SignalBus generic array, and the matrix UI are all known-shape at compile time. No add/remove affordance, no rename, no labels override. Trade-off accepted: no headroom for elaborate multi-tier compositions; deferred to a future schema version if it actually limits anyone.
- **Sinks store the bias-scale-signal triple, not just a value.** This matches the Archimedean widget exactly. The actually-applied audio-param value is computed every signal tick: `copula([bias, scale * comboBus[signal]])`.
- **Sources are not in the preset** — they're declared at runtime by engines. The preset only references their stable IDs. If a referenced source is missing on load, the entry stays dormant (avoids hostile failures when reloading on a different machine).
- **Sparse matrix.** Only non-zero entries; zero entries don't bloat presets or trigger work.
- **Voices own their sinks.** Adding/removing a voice adds/removes the sinks it provides.
- **`$schema` field** for future migrations.

The ConfigStore is literally this object, reactively wrapped.

---

## Stage 0 — Foundation (1–2 days, detailed)

**Goal:** Empty Vite + TS app boots, dev server hot-reloads, lint/format/test wired, CI builds.

**Concrete tasks:**
1. New repo (or fresh `master` branch — confirm with user). `npm create vite@latest synestizer -- --template vanilla-ts`.
2. `tsconfig.json` strict mode + `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
3. Biome (single tool for lint+format) configured with sensible defaults.
4. Vitest + jsdom for unit tests; one smoke test.
5. `vite-plugin-pwa` placeholder config (offline support comes in stage 7).
6. GitHub Actions: typecheck, lint, test, build on PR.
7. Decide deployment target now (gallery rsync from old `package.json` script suggests SSH-deploy to `listentocolors:gallery_listentocolors_net`; Netlify/Cloudflare Pages is simpler).

**Critical files:** `package.json`, `vite.config.ts`, `tsconfig.json`, `biome.json`, `index.html`.

**Done when:** `npm run build` produces a deployable `dist/`; visiting it shows a stub page.

---

## Stage 1 — Data model + preset schema (2–3 days, detailed)

**Goal:** ConfigStore exists, can be created, mutated, serialised, and round-tripped from JSON. No audio, no UI yet — just types and tests.

**Concrete tasks:**
1. `src/preset/schema.ts` — TypeScript types as above. Include zod (or valibot) runtime schema for parsing untrusted JSON.
2. `src/preset/migrate.ts` — stub: just validates `$schema === "synestizer/v1"` and rejects others. Migration framework to extend later.
3. `src/preset/defaults.ts` — `defaultPreset()` returning a minimal valid preset (master + zero sources/sinks/voices/matrix).
4. `src/store/config-store.ts` — `ConfigStore` class. Holds a `Preset`. Provides:
   - `get<T>(path)` typed accessor
   - `update(mutator)` — runs an Immer-style draft producer, computes a JSON Patch, emits change events with the patch
   - `subscribe(pathGlob, fn)` — fine-grained subscription so a Web Component for `master.gainDb` only fires when *that* changes
   - `snapshot()` returns frozen Preset; `load(preset)` validates + replaces.
5. One round-trip test: default preset → JSON → parse → structurally equal. Rejection of malformed JSON gets covered by zod itself.

**Critical files:** `src/preset/schema.ts`, `src/store/config-store.ts`.

**Reused from old code:** Conceptually similar to [src/lib/signalMangle.js](src/lib/signalMangle.js), but Immer-driven and typed. **Do not** reuse the old code — it's tangled with Redux internals.

**Done when:** A test creates a default preset, mutates `master.gainDb`, fires a granular subscription, serialises to JSON, parses back, structurally equal.

---

## Stage 2 — Signal bus + copula math (3–4 days, detailed)

**Goal:** Real-time signal infrastructure exists, independent of audio/video/UI. Pure math + dispatch, fully unit-tested. Two-stage graph wired and tested with mock sources.

**Concrete tasks:**
1. `src/signal/transform.ts` — port `saturate`, `desaturate`, `clip`, `clipinf`, `linBipol`, `bipolLin`, `bipolEquiOctave`, `intBipol`, `bipolMidi` from [src/lib/transform.js](src/lib/transform.js). Constant `sevenBitSafe = 127.5/128` carries through verbatim. No tests needed — these are pure 1-line math conversions.
2. `src/signal/copula.ts` — **first-class module.**
   - `copula(vals: Float32Array | number[]) => number` — implementation: `saturate(Σ desaturate(v))`.
   - One sanity test: `copula([x]) ≈ x` and `copula([x, -x]) ≈ 0` for a few concrete values. Mathematical properties (monotonicity, commutativity, smoothness) follow from the algebra and don't need test coverage.
   - Hot-path version that takes a flat `Float32Array` of pre-multiplied scaled-source values and returns a single scalar, no allocations.
3. `src/signal/bus.ts` — `SignalBus` class. Three slot arrays:
   - `sources: Float32Array` — primary inputs from video/MIDI/etc., dynamically sized as engines register sources.
   - `generics: Float32Array` of length **8** — α … θ. Fixed at compile time. Combo keys `"generic.0"` … `"generic.7"`.
   - `sinks: Float32Array` — audio params (Stage 2 outputs, post bias+scale+copula).
   - The "combo bus" is conceptual — a sink's `signal` field is a string key; we resolve it once to a `(arrayRef, slotIdx)` tuple at config-change time.
   - `registerSource(id)` / `registerSinkOwner(id, kind)` — managed by engines and config binder. Generic slots need no registration.
   - Hot path: `writeSource(slot, value)`, `readSink(slot)`, `readGeneric(slot)`, `readCombo(comboKey)`. Zero allocations per frame.
   - `subscribeFrame(cb)` — called once per signal tick after both stages computed.
   - `export const GENERIC_COUNT = 8` and `export const GENERIC_LABELS = ['α','β','γ','δ','ε','ζ','η','θ']` for UI consumption.
4. `src/signal/graph.ts` — compiles a `Preset` into a flat numeric plan:
   - For each generic g, a slice of `(sourceSlot, scale)` tuples to copula-combine.
   - For each sink s, a tuple `(comboKey → sourceArrayRef, slot, bias, scale, range)` for the bias+scale+copula step.
   - Recompiled when ConfigStore matrix/sinks/generics change (low-freq, on user edit only).
5. `src/signal/scheduler.ts` — fixed-rate tick (100 Hz default). Each tick:
   - Stage 1: for each generic g, compute `generics[g] = copula(over its plan tuples)`.
   - Stage 2: for each sink s, compute `sinks[s] = copula([bias, scale * comboValue(signal)])`, then map through `range` to engineering units in a separate per-kind output buffer.
   - Single `subscribeFrame` callback fires.
6. One end-to-end test: 2 sources + 2 generics + 2 sinks with a hand-computed reference. That's enough to catch wiring mistakes; the math underneath is trusted.

**Critical files:** `src/signal/{bus,transform,copula,graph,scheduler}.ts`.

**Reused from old code (port, don't import):** `saturate` / `desaturate` / `perturb` from [src/lib/transform.js](src/lib/transform.js); two-stage observable wiring from [src/io/signal.js](src/io/signal.js) (concept, not code — RxJS dropped).

**Done when:** End-to-end signal test passes; running the scheduler in the browser doesn't show GC churn in DevTools (eyeball check, not a perf gate).

---

## Stage 3 — Audio engine MVP (3–4 days, detailed)

**Goal:** One simple voice (e.g. a `Tone.PolySynth`) plays through the master bus. Output device selectable via `setSinkId`. Sink signals from the bus drive synth params.

**Concrete tasks:**
1. `npm i tone@^15` — modern, npm-published, TS-native.
2. `src/audio/engine.ts` — `AudioEngine` class. Holds `Tone.getContext()`, `Tone.getDestination()`, master `Gain` + `Limiter`. Reads `master.*` from ConfigStore.
3. `src/audio/device.ts` — `setOutputDevice(deviceId)` using `(audioContext.destination as any).setSinkId(deviceId)` (with feature detection + fallback to `<audio>` element route). **This is the Firefox fix.**
4. `src/audio/voice/registry.ts` — `VoiceKind` discriminated union; one initial implementation: `BasicVoice` (sine + envelope, exposes `freq`, `gain`, `detune` as sinks).
5. `src/audio/voice/basic.ts` — registers its sinks with the SignalBus on instantiation; on each signal tick reads its sink slots and pokes Tone params via `Tone.Signal` to avoid zipper noise.
6. `src/audio/binder.ts` — wires ConfigStore voice list ↔ live voice instances; on `voices[]` change, instantiate/dispose.
7. UI stub: a `<button>` that resumes audio context on user gesture, a `<select>` for output device, a `<input type=range>` for `master.gainDb`. Plain DOM, no Web Components yet.

**Critical files:** `src/audio/{engine,device,binder}.ts`, `src/audio/voice/{registry,basic}.ts`.

**Done when:** Click "start", pick output device, hear a tone, slider changes its volume in real time. Works in Firefox.

---

## Stage 4 — Camera + video worker (2–3 days)

**Goal:** Camera input flows through Web Worker → produces video source signals → SignalBus → projector → audible.

**Concrete tasks:**
1. `src/video/camera.ts` — `getUserMedia({video:true})` with proper permission handling, error UI for denied.
2. `src/video/worker.ts` — Web Worker (Vite has first-class support via `?worker` imports). Receives ImageBitmap or ImageData, computes 64×64 stats: mean R/G/B, luma, simple HSV histogram bins. **No RxJS** — plain `postMessage`.
3. `src/video/source-driver.ts` — main-thread loop using `requestVideoFrameCallback` (modern, replaces the old `setInterval` + draw pump in [src/io/video.js:106-110](src/io/video.js:106-110)). Sends frames to worker; receives stats; writes them to SignalBus source slots.
4. Source registration: when a `kind: "video.*"` source appears in the preset, the video engine claims its slot.

**Critical files:** `src/video/{camera,worker,source-driver}.ts`.

**Done when:** Wave a red object at the camera; with `{video.r → voice.basic.gain: 1.0}` in the preset, the tone gets louder.

---

## Stage 5 — UI: Web Components rendering SVG, with direct-DOM live updates (5–7 days)

**Goal:** All discrete controls (matrix cells, Archimedean sliders, faders, meters) are Web Components that render SVG inside their shadow root. Config-bound attributes go through the small reactive layer; **live signal indicators (the perturbation needles) are written directly to DOM via `setAttribute('points', ...)` on rAF, bypassing any framework**. Camera preview and audio scope use Canvas.

**Why SVG inside Web Components, not Canvas (revised position from earlier scoping):**
- The original SVG widgets (Archimedean, ScaleSlider) are visually intricate (6+ overlapping primitives) — declarative SVG is dramatically more readable than imperative canvas draw code.
- The perf bug in the original was **not** SVG; it was React 15 reconciling SVG attributes triggered by Redux store invalidations. Removing React + Redux removes the bug.
- SVG hit-testing per cell is free; canvas hit-testing requires hand-rolled coord math.
- SVG gets accessibility, CSS theming, hi-DPI, and inspector debugging for free.
- At expected scale (~30 sources × ~30 generics + ~30 sinks ≈ 900 matrix cells + 30 sliders), direct attribute writes on rAF are inexpensive.
- Canvas is reserved for: camera preview, audio scope/spectrum, and a deferred fallback path if matrix cell counts ever exceed ~2,500.

**Concrete tasks:**
1. Tiny reactive layer: `src/ui/reactive.ts` — `bindConfig(el, path)` for two-way binding between a property and ConfigStore. `bindSignal(el, comboKey, fn)` for rAF-driven SignalBus → DOM mutation. ~80 LOC, no framework. Optional: `@preact/signals-core` if we want fancier reactivity (not React).
2. Base class: `src/ui/components/base.ts` — `SynElement` extends `HTMLElement` with helpers for shadow-root template instantiation, attribute reflection, and rAF lifecycle.
3. **`<syn-scale-slider>`** — used as a matrix cell. Renders the SVG from [ScaleSliderSVG.js](src/components/ScaleSliderSVG.js):
   - Static layer (config-bound): the signed-scale arrow polygon, backing rect, centerline.
   - Live layer (rAF, signal-bound): the "shadow arrow" `<polygon>` representing the per-cell perturbation = `scale * desaturate(comboBus[source])`. Cached `<polygon>` ref; on rAF, `polygonRef.setAttribute('points', ...)`.
   - Pointer drag → `ConfigStore.update(p => p.matrix[idx].scale = newVal)`.
4. **`<syn-archimedean-slider>`** — used for audio params. Renders [ArchimedeanSliderSVG.js](src/components/ArchimedeanSliderSVG.js):
   - Static layer: bias track, scale arrow, label.
   - Live layer (rAF): perturbed-value thumb position, perturbation envelope outline polygon.
   - Two drag affordances: bias-track drag → `update(p => p.sinks[idx].bias = ...)`; scale-arrow drag → `update(p => p.sinks[idx].scale = ...)`.
   - Combo-signal selector via `<syn-select>` for `sinks[idx].signal`.
5. **`<syn-patch-matrix>`** — composes a grid of `<syn-scale-slider>` cells. Adds row/column headers (`<syn-signal-header>`) showing source/generic name + per-row/column live perturbation magnitude. The matrix container is HTML (`<table>` or CSS grid), not Canvas; cells are SVG-bearing custom elements.
6. **`<syn-meter signal-id="...">`** — small Canvas (cheap, redraw-from-scratch each frame is fine for a 60×16 px meter). rAF-bound to SignalBus.
7. **`<syn-camera-preview>`** — Canvas; renders the 64×64 worker-input crop. Useful for debugging signal mappings.
8. Static controls as Web Components: `<syn-slider>` (1D linear), `<syn-select>`, `<syn-toggle>` for plain master/device controls.
9. Layout: CSS grid in `index.html`, no router (single page). Theme via CSS variables.

**Critical files:** `src/ui/components/{base,scale-slider,archimedean-slider,patch-matrix,signal-header,meter,camera-preview,slider,select,toggle}.ts`, `src/ui/reactive.ts`, `index.html`, `src/ui/style.css`.

**Reused from old code (port, don't import):** SVG geometry math from [ScaleSliderSVG.js](src/components/ScaleSliderSVG.js) and [ArchimedeanSliderSVG.js](src/components/ArchimedeanSliderSVG.js); pointer/touch gesture logic from [GestureableSVG.js](src/components/GestureableSVG.js) (drop RxJS, use Pointer Events directly).

**Done when:**
- Patch matrix renders, drag-edits cells, shows live perturbation indicators that animate at rAF rate without triggering ConfigStore changes.
- Archimedean sliders edit bias and scale independently; perturbation envelope animates from SignalBus.
- DevTools Performance flame chart on a typical patch session shows: zero React-equivalent reconciliation, all DOM mutations are isolated `setAttribute` calls inside rAF callbacks, no layout thrash.
- Works in Firefox + Chrome.

---

## Stage 6 — Preset save/load + URL load (2 days)

**Goal:** Users can save the current ConfigStore as JSON, load JSON into the store, share via URL.

**Concrete tasks:**
1. `<syn-preset-widget>` with download/upload buttons.
2. `?preset=<url>` query param: fetch and load on boot.
3. `localStorage` autosave of the current preset (debounced).
4. Bundled default presets in `public/presets/*.json`; preset picker UI.

**Critical files:** `src/preset/io.ts`, `src/ui/components/preset-widget.ts`.

**Reused concept** from old [src/actions/app.js:26-58](src/actions/app.js:26-58) `loadFromUrl` thunk.

---

## Stage 7 — MIDI in/out (3–4 days)

**Goal:** Web MIDI sources and sinks fully wired, including device selection.

- `src/midi/engine.ts` — `requestMIDIAccess()`, device enumeration, hot-plug listener.
- Sources: `kind: "midi.cc"` registers a SignalBus slot that updates on incoming CC.
- Sinks: outgoing CC sends throttled to MIDI rate; uses `MIDIOutput.send`.
- UI: device pickers, "learn CC" affordance.

Reused concept (not code) from [src/io/midi.js](src/io/midi.js).

---

## Stage 8 — BubbleChamber port (5–7 days)

Port the 4-voice sampler+FM+bass synth from [src/io/audio/bubbleChamber.js](src/io/audio/bubbleChamber.js) (~220 LOC) to the new voice system. Tone v15 has all of `Sampler`, `MonoSynth`, `FeedbackDelay`, `Loop`, `Transport`. Mostly mechanical translation; the real work is registering all the voice params correctly as sinks.

Sample assets stay in `public/sound/` (verbatim copy of existing `sound/` directory — copyleft attributions in README preserved).

---

## Stage 9 — PWA + service worker + offline (1–2 days)

`vite-plugin-pwa` with cache-first strategy for assets and sound samples. Replaces the bespoke 174-line [src/sw.js](src/sw.js).

---

## Stage 10 — Recording + randomize + polish (3–5 days)

- `MediaRecorder` on a `MediaStreamDestination` from the audio context. Replaces `Tone.Recorder` use in [src/io/audio/recordBuffer.js](src/io/audio/recordBuffer.js).
- Randomize action: deterministic-with-seed perturbation of matrix scales.
- Welcome pane, FAQ link, gallery presets.

---

## Cross-cutting concerns

**AudioWorklet escape hatch:** stage 8 onwards, any voice that wants sample-accurate custom DSP can register an AudioWorkletProcessor and expose its params as sinks. Tone.js doesn't fight this — it just wraps `AudioContext`. Set this up as a documented pattern in stage 3 (one example worklet) so later stages know the path.

**Performance budget (worth defending in code review):**
- Zero allocations in the per-frame projection path.
- ConfigStore writes are user-driven only; no engine writes back.
- Canvas redraws on rAF, not per signal write.
- The full source×sink matrix should redraw on config change in <2 ms for N=64 sources × M=64 sinks.

## Verification (per stage and end-to-end)

Each stage ends with:
- The handful of unit tests for that stage passing (mostly the copula sanity test + the end-to-end signal test).
- `npm run build` produces a deployable bundle.
- A manual smoke checklist for that stage's user-visible feature (camera, matrix, audio out, MIDI, etc.) in Chrome **and** Firefox.

Testing posture: lean. Trust standard math identities. Rely on the visible UX as the integration test for everything from stage 3 onwards. Reach for unit tests only where a wiring mistake is plausible and not visible (the signal graph compiler is the canonical example).

End-to-end manual test for v1 release:
1. Cold-load app in Firefox + Chrome.
2. Permit camera + microphone.
3. Pick non-default audio output device (validates `setSinkId` path).
4. Load a bundled preset; confirm the camera-driven sound matches.
5. Edit matrix cells; confirm sound changes; observe no per-signal-tick re-renders in DevTools Performance panel.
6. Save preset to JSON; reload page; load JSON; confirm identical state.
7. Connect a MIDI controller (when stage 7 ships); confirm CC routing.

## Critical files in the *existing* codebase to mine for reference

These are *not* to be ported — they're reference implementations of the algorithms we'll rewrite:

- [src/lib/transform.js:30-33](src/lib/transform.js) — **the copula `perturb` operation** (named "perturb" in original; renamed `copula` in rebuild). The defining math.
- [src/lib/transform.js](src/lib/transform.js) — full set of bipolar/MIDI/percentage/log-octave conversions. Port verbatim with constants.
- [src/io/signal.js:52-75](src/io/signal.js) — two-stage projection algorithm + `comboStateSubject` semantics. Port concept to `src/signal/scheduler.ts` (drop RxJS; use the typed bus).
- [src/io/signal/util.js](src/io/signal/util.js) + [src/lib/names.js](src/lib/names.js) — greek-letter naming for generics.
- [src/io/video/statModels.js](src/io/video/statModels.js) — the `Moment()` source bank (60 video signals: bright/blue/red, color×spatial co-moments, deltas, integrals). The math is non-trivial (PCA-flavored colour space, central moments, normalisation choices, ∆ and ∫ operators with timestamps). Port verbatim or with light cleanup; this is what makes the app interesting to play with.
- [src/io/video/videoworker.js](src/io/video/videoworker.js) — worker harness. Port to `src/video/worker.ts`; drop RxJS, plain `postMessage`.
- [src/components/ScaleSliderSVG.js](src/components/ScaleSliderSVG.js) — matrix-cell widget geometry. Port SVG math directly into `<syn-scale-slider>`.
- [src/components/ArchimedeanSliderSVG.js](src/components/ArchimedeanSliderSVG.js) — bias-and-scale audio-param widget. Port SVG math directly into `<syn-archimedean-slider>`. Note the perturbation-envelope polygon at lines 152-155 — this is the visual coupling of bias↔scale↔live value, must be preserved.
- [src/components/GestureableSVG.js](src/components/GestureableSVG.js) — pointer/touch drag handler. Concept only; rewrite using Pointer Events.
- [src/io/audio/bubbleChamber.js](src/io/audio/bubbleChamber.js) — voice topology. Port to a Tone v15 voice in stage 8.
- [src/lib/signalMangle.js](src/lib/signalMangle.js) — old preset format; informs *what not to do* when designing v1 schema.
- [sound/](sound/) — sample assets to copy verbatim.
- [docs/](docs/) — existing documentation, useful for understanding intent.

## Decision log

Each entry: what was decided, the reasoning, and what would justify revisiting it. Future assistants reading this plan: please don't relitigate these without new information.

1. **Complete rewrite, not incremental.** Toolchain (Webpack 1, Babel 6, React 15, Redux 3, RxJS 5, react-addons-perf) is dead. The core perf bug — Redux misused as a 100 Hz signal bus — is architectural, not patchable without major surgery anyway. Revisit only if scope shrinks dramatically (e.g. "just fix the Firefox bug, ignore everything else").

2. **Plain TS + Web Components + Vite, not React / Solid / Svelte / Rust+WASM.** Minimum dependencies; Web Components are browser-native and won't suffer the "framework dead in 5 years" problem the original hit. WASM was tempting (user mentioned "kind of wish we had Rust") but adds toolchain complexity that doesn't pay off for this scale. Revisit if a future audio core demand exceeds AudioWorklet capabilities.

3. **Tone.js v15 + AudioWorklet escape hatch, not pure AudioWorklet or WASM DSP.** Tone v15 is npm-published, TS-native, well-maintained. Reimplementing scheduler/transport/sampler is a year of work that doesn't move the artistic concept forward. AudioWorklet is the path for any custom DSP that Tone's built-ins can't express. Revisit per-voice if Tone's abstraction proves limiting.

4. **SVG inside Web Components with direct DOM mutation, not Canvas (for controls).** The original perf bug was React 15 reconciling SVG attrs from Redux; that bug doesn't exist without React. SVG widgets are visually intricate (Archimedean = 6+ overlapping primitives) — declarative SVG reads better than imperative canvas. Hit-testing, accessibility, CSS theming, hi-DPI all free. Canvas reserved for camera preview, scope/spectrum, and a deferred fallback only if matrix cell counts ever exceed ~2,500.

5. **Two-stage signal graph: sources → 8 fixed generics (α … θ) → sinks.** Generics are the abstraction layer that makes complex routings tractable; without them, every source has to be wired to every audio param. Fixed at 8 for v1 — no resize affordance, no renaming. Revisit only if 8 demonstrably isn't enough in practice; doing so means a v2 preset schema, not a config tweak.

6. **Copula combination is the named first-class operation.** `copula(vals) = saturate(Σ desaturate(vals))`. The math (smooth, signed, never clips, monotone, near-linear near zero) is what makes the synth feel musical rather than crashy. The original called this `perturb`; renamed to make the framing legible. Do **not** replace with sum-and-clip "as a simplification" — it would change the sonic character.

7. **Sinks store `{signal, bias, scale}`, not just a value.** Bias = rest value; scale = modulation depth. The applied audio param is `copula([bias, scale · signal])`. This matches the Archimedean widget exactly and is what makes the patch board playable rather than chaotic.

8. **Two-tier state, never mixed: ConfigStore (slow, persistent) vs SignalBus (fast, ephemeral).** Iron rule: no signal-rate value enters ConfigStore. Meters read SignalBus on rAF. ConfigStore changes are user actions only. Violating this rule is what tanked the original.

9. **Audio param writes are always ramped (`linearRampTo ~10 ms`), enforced by the audio binder.** Voice authors can't bypass it. Eliminates zipper noise as a class without per-voice effort.

10. **Control loop (100 Hz copula tick) runs on the main thread, not in a worker.** Needs `Tone.Signal` access; worker round-trips add latency without buying anything. Video stats stay in a Web Worker because that's CPU-bound off-thread work that doesn't need to write to Tone.

11. **No back-compat with the old preset format.** Old format leaks Redux internals; an importer would couple us to obsolete reducer logic. Clean break. Revisit only if there's a specific shareable preset corpus worth preserving — at which point write a one-shot script rather than runtime importer code.

12. **Service Worker is for offline caching only, not part of any data flow.** It exists for PWA installation and offline replay (stage 9). Don't confuse it with Web Workers (off-main-thread compute, used for video stats) or AudioWorklet (audio-thread DSP, used for any custom synth code).

13. **Lean testing.** Math identities and standard library behavior are trusted. Tests cover plausible wiring mistakes that visible UX won't catch (the signal-graph compiler, preset JSON round-trip). Visible UX is the integration test for everything UI-driven from stage 3 onwards. Don't write property-based test suites for textbook math.

14. **Staged, not big-bang.** Each stage ends with a working app and a deployable bundle. Stages can be paused, scope-cut, or re-ordered without abandoning prior work.

## Open follow-ups (not blocking the plan)

- Confirm: new repo, or fresh branch on this one?
- Deployment: keep rsync to `listentocolors`, or move to Netlify/Cloudflare Pages?
- Do you want to keep `tone` as a hard dep, or treat it as "stage 3 starter, replaceable later"?
