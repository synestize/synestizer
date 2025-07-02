# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Synestizer is a web application that creates sound from color and movement detected by your webcam. It's a synesthetic audio-visual experiment built with React, Redux, RxJS, and Tone.js that runs entirely in the browser.

## Development Commands

```bash
# Start development server with hot reloading
npm run dev

# Build for production
npm run build

# Build gallery version
npm run build:gallery

# Clean build artifacts
npm run clean
```

The development server runs at http://localhost:8080 and requires webcam/microphone permissions.

## Architecture Overview

### Dual-Layer Architecture
The application follows a strict separation between UI and I/O:

1. **App Layer** (`src/components/`, `src/containers/`, `src/actions/`, `src/reducers/`): React+Redux UI that manages application state
2. **IO Layer** (`src/io/`): RxJS-based interfaces to browser APIs (MIDI, Video, Audio) that operate independently and communicate through the Redux store

### State Management - Hybrid Redux System
The project uses a **hybrid Redux setup** combining modern Redux Toolkit with legacy reducers:

- **Modern**: GUI state uses Redux Toolkit slices (`src/features/gui/guiSlice.js`)
- **Legacy**: Audio, MIDI, Video, Signal use traditional Redux (`src/reducers/`)
- **Store**: Configured with Redux Toolkit's `configureStore` but wraps legacy reducers
- **Persistence**: Uses redux-persist with LocalForage storage

### IO Modules Architecture
Each IO module (`src/io/audio.js`, `src/io/midi.js`, `src/io/video.js`, `src/io/signal.js`) follows the same pattern:
- Exports a factory function that takes `(store, signalio, [additional deps])`
- Uses RxJS observables to interface with browser APIs
- Subscribes to store changes via `toObservable(store)` helper
- Dispatches actions to update Redux state
- Uses modern RxJS v7 pipe syntax throughout

### Signal Processing Flow
1. **Video IO**: Captures webcam, analyzes color/motion, outputs signals
2. **Signal IO**: Central hub processing/routing video signals to audio/MIDI
3. **Audio IO**: Uses Tone.js to generate sounds from signals
4. **MIDI IO**: Converts signals to MIDI CC messages

### Key Technologies
- **React 18**: Modern createRoot API, functional components
- **Redux Toolkit**: Modern store configuration with legacy reducer compatibility
- **RxJS v7**: Stream processing with pipe operators
- **Tone.js v15**: Web Audio API synthesis and effects
- **Webpack 5**: Modern build system with worker-loader for video processing

### Build System
- **Babel**: Modern ES6+ transpilation with React JSX
- **Webpack 5**: Development server, hot reloading, worker loading
- **Legacy peer deps**: Uses `--legacy-peer-deps` for compatibility

### Critical Implementation Details
- All RxJS imports use modern v7 syntax (`import { Observable } from 'rxjs'`)
- Worker imports require `worker-loader!` prefix
- Tone.js imports use `import * as Tone from 'tone'`
- Redux store handles special `RESET_TO_NOTHING` and `LOAD` actions for preset management
- Volatile state (`__volatile`) is blacklisted from persistence