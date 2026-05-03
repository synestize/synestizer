# 🎵 Synestizer

**Transform colors and movement into sound** - A real-time audio-visual synesthetic experience that runs entirely in your browser.

Synestizer uses your webcam to detect colors and motion, then generates corresponding sounds and music using advanced web audio synthesis. Experience the fascinating intersection of sight and sound through this interactive digital instrument.

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

---

## ⚠️ The codebase is being rewritten

Active development now happens in [`new/`](./new) — a TypeScript + Vite + Web Components rewrite of the 2016-era React/Redux/Webpack app at the repo root. See [REBUILD_PLAN.md](./REBUILD_PLAN.md) for the staged rewrite plan and [AGENTS.md](./AGENTS.md) for orientation.

The original tree at the root (`src/`, `webpack.config.js`, `package.json`) still exists for reference and is what the **Legacy app** section below describes. New features go in `new/` only.

### Run the new app (Vite dev server)

```bash
cd new
npm install        # one-time
npx vite           # dev server on http://localhost:5173/
```

Then open `http://localhost:5173/`, click **Start audio** (browser autoplay policy), then **Start camera**. You should hear a continuous tone whose loudness, pitch, and detune track what the camera sees.

### Verify, build, lint (run from `new/`)

```bash
npx tsc --noEmit          # typecheck (strict)
npx vitest run            # unit tests
npx vite build            # production build → new/dist/
npx vite preview          # serve the prod build locally
npx biome check --write src   # lint + format with autofix
```

Browser requirements: a recent Chrome or Firefox served from `localhost` or HTTPS (camera and `setSinkId` need a secure context). Don't open `new/dist/index.html` via `file://` — those APIs won't work.

---

> Everything below describes the **legacy** React + Redux + Webpack app at the repo root. It still runs (the live demo at https://synestize.github.io/synestizer/ is built from it), but is no longer where features land. For the current dev workflow, use the section above.

## ✨ Features

- 🎥 **Real-time Video Analysis**: Uses your webcam to detect colors and movement
- 🎵 **Audio Synthesis**: Generates music using Tone.js and Web Audio API
- 🎹 **MIDI Integration**: Send and receive MIDI control messages
- 🎛️ **Signal Routing**: Advanced patch matrix for connecting video signals to audio parameters
- 🎨 **Multiple Instruments**: Choose from various synthesized and sampled instruments
- 💾 **Preset System**: Save and load your configurations
- 🔄 **Real-time Controls**: Adjust parameters while the system is running

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **Modern web browser** with webcam and microphone support
- **HTTPS connection** (required for webcam access)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/synestize/synestizer.git
   cd synestizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:8080`
   - Allow webcam and microphone permissions when prompted
   - Click "🚀 Start Synestizer" to begin

## 🛠️ Development

### Available Scripts

```bash
# Start development server with hot reloading
npm run dev

# Build for production
npm run build

# Build gallery version (minimal UI)
npm run build:gallery

# Clean build artifacts
npm run clean
```

### Project Structure

```
src/
├── components/          # Reusable UI components
├── containers/          # Main app container
├── features/            # Feature-based modules (Redux slices + components)
│   ├── audio/          # Audio synthesis and effects
│   ├── midi/           # MIDI input/output handling  
│   ├── video/          # Video capture and analysis
│   ├── signal/         # Signal processing and routing
│   └── gui/            # User interface state
├── io/                 # Browser API interfaces (RxJS-based)
├── lib/                # Utility libraries
└── polyfills/          # Browser compatibility shims
```

### Architecture Overview

Synestizer follows a **dual-layer architecture**:

1. **App Layer**: React + Redux Toolkit for UI and state management
2. **IO Layer**: RxJS streams interfacing with browser APIs (video, audio, MIDI)

The IO layer operates independently and communicates with the App layer through the Redux store, enabling real-time performance while maintaining predictable state management.

## 🎮 Usage

### Basic Workflow

1. **Start the application** and grant camera/microphone permissions
2. **Video Analysis**: The app analyzes your webcam feed for colors and motion
3. **Signal Routing**: Map video signals to audio parameters using the patch matrix
4. **Sound Generation**: Audio is synthesized in real-time based on visual input
5. **Fine-tuning**: Adjust parameters, swap instruments, and create presets

### Key Controls

- **Settings Tab**: Configure video sources, audio devices, and MIDI connections
- **Sound Tab**: Choose instruments, adjust audio parameters, and control effects  
- **Performance Tab**: Access the signal patch matrix for advanced routing
- **Preset System**: Save/load configurations via the app state controls

## 🔧 Technical Details

### Technologies Used

- **React 18** with modern hooks and functional components
- **Redux Toolkit** for predictable state management
- **RxJS 7** for reactive stream processing
- **Tone.js 15** for Web Audio API synthesis
- **Webpack 5** for modern build tooling
- **Babel** for ES6+ transpilation

### Browser Requirements

- **WebRTC** support for camera access
- **Web Audio API** for sound synthesis
- **WebMIDI API** for MIDI functionality (optional)
- **Modern JavaScript** features (ES2018+)

### Performance Notes

- Optimized for **60fps video analysis**
- **Low-latency audio** processing (< 20ms)
- **Efficient memory usage** with stream-based architecture
- **Background processing** via Web Workers for intensive tasks

## 📄 License

This project is licensed under the **GNU General Public License v3.0** - see the [LICENSE](LICENSE) file for details.

### Audio Samples

The included audio samples are derived from Creative Commons and other copyleft sources:

- **Goblet sounds**: From freesound.org user "acclivity"
- **Kayageum samples**: From freesound.org user "spt3125"  
- **Tabla sounds**: From freesound.org user "ajaysm"

Full attribution details are preserved in the original README sections below.

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines and feel free to submit issues and pull requests.

## 🔗 Links

- **Live Demo**: [https://synestize.github.io/synestizer/](https://synestize.github.io/synestizer/)
- **Documentation**: [https://synestize.github.io/synestizer/](https://synestize.github.io/synestizer/)
- **Repository**: [https://github.com/synestize/synestizer/](https://github.com/synestize/synestizer/)

---

## Original Attribution Information

### Copyleft Content

Certain content is derived from copylefted samples, in particular

**goblet_g3.mp3** is a derivative work

File:
	Name: "Goblet_G_Loud.wav"
	Url: http://freesound.iua.upf.edu/samplesViewSingle.php?id=30602
	Date of upload: 2007-02-06 13:49:03

Designer / Creator / Uploader:
	Name: "acclivity"
	Url: http://freesound.iua.upf.edu/usersViewSingle.php?id=37876

Description:
	By "acclivity" : Another silver plated goblet pinged loudly with a finger nail. Time stretched by 1.5 percent to tune it to G. Sony ECM-MS957, MZ-N10, iRiver

**kayageum_b4.mp3** is a derivative work

File:
	Name: "kayageum1_B4.wav"
	Url: http://freesound.iua.upf.edu/samplesViewSingle.php?id=24556
	Date of upload: 2006-10-28 20:42:35

Designer / Creator / Uploader:
	Name: "spt3125"
	Url: http://freesound.iua.upf.edu/usersViewSingle.php?id=164315

Description:
	By "spt3125" : single string plucked medium-loud with finger, allowed to decay.  this is string 21 of 23, pitch B4 (494 Hz).
recorded with stereo pair of oktava mk012 mics overhead, XY-ish.

**tabla_na_d3.mp3** is a derivative work

This pack of sounds contains sounds by the following user:
 - ajaysm ( https://www.freesound.org/people/ajaysm/ )

You can find this pack online at: /people/ajaysm/packs/10737/

License details
---------------

  * 171905__ajaysm__na-stroke.wav
    * url: https://www.freesound.org/s/171905/
    * license: Attribution