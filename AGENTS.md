# Notes for AI coding assistants

This codebase is being rewritten. The current `master` branch contains a working but unmaintainable 2016-era React 15 + Redux 3 + Webpack 1 + Babel 6 + RxJS 5 + Tone.js app. **Before making substantial changes, read [REBUILD_PLAN.md](REBUILD_PLAN.md).** It explains the architecture of the current code, the problems with it, and the staged plan for the replacement — including a decision log so you don't have to relitigate settled choices.

## What this means in practice

- **Treat the existing code under `src/`, `index.html`, `webpack*.config.js`, etc. as reference, not foundation.** It works, but it's not where new features go. The plan calls out specific files (e.g. [src/lib/transform.js](src/lib/transform.js), [src/io/video/statModels.js](src/io/video/statModels.js), [src/components/ArchimedeanSliderSVG.js](src/components/ArchimedeanSliderSVG.js)) whose algorithms or geometry should be ported into the new app. Other files are likely to be replaced wholesale.
- **The rebuild lives in a new top-level structure** (Vite + TS + Web Components, see plan). Do not graft new code into the old React/Redux tree.
- **The decision log in `REBUILD_PLAN.md` is load-bearing.** If you find yourself wanting to use Canvas instead of SVG, or fast-check property tests instead of a single sanity test, or Redux instead of the two-tier ConfigStore + SignalBus split — read the relevant decision log entry first. The reasoning is there.
- **Iron rule:** no signal-rate value (anything updating at 30+ Hz from video, MIDI, or the copula loop) enters the ConfigStore. Meters and live indicators read from the SignalBus on `requestAnimationFrame`. Violating this is what tanked the original.

## What the app does

Synestizer maps live camera input to audio synthesis ("hear color"). The interesting bit is the routing: video pixel statistics → user-edited patch matrix → 8 greek-letter intermediate buses → audio synth params, with a smooth signed "copula" combination operation throughout.

If you're picking up this work, the first thing to read after this file is [REBUILD_PLAN.md](REBUILD_PLAN.md) start-to-finish. It's long but each section has a job; skipping the decision log especially is a false economy.
