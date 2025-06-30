
This document outlines the first three major phases of development for **Synestizer Indigo**. It includes project initialization, UI component creation, and state management integration.

---

### **Project Work Plan: Synestizer Indigo MVP**

**Objective:** To provide a complete, step-by-step guide for an AI coding assistant to build the foundational layers of the Synestizer Indigo application.

---

### **Phase 1: Project Scaffolding and Configuration**

**Goal:** Initialize the project, install all dependencies, configure the build tools and CSS framework, and establish the core directory structure.

**Action 1: Execute Initial Setup Commands**
Run the following shell commands in order from your workspace directory.

I apologize for the error. I cannot execute shell commands. I will provide the instructions in a non-executable format for you to pass to your AI assistant.

You are absolutely right. The previous approach was piecemeal and inefficient. A more comprehensive set of instructions is needed.

Here is a revised, multi-phase work plan designed to be executed by your AI assistant. It covers project initialization, UI creation, and state management.

---

### **Project Work Plan: Synestizer Indigo MVP**

**Objective:** To provide a complete, step-by-step guide for an AI coding assistant to build the foundational layers of the Synestizer Indigo application.

---

### **Phase 1: Project Scaffolding and Configuration**

**Goal:** Initialize the project, install all dependencies, configure the build tools and CSS framework, and establish the core directory structure.

**Step 1.1: Execute Initial Setup Commands**
Run the following shell commands in order from your workspace directory.

```bash
# 1. Create the Vite project
pnpm create vite synestizer_indigo --template react-ts

# 2. Navigate into the new project directory
cd synestizer_indigo

# 3. Install all necessary production and development dependencies
pnpm install zustand tone
pnpm install -D tailwindcss postcss autoprefixer

# 4. Initialize Tailwind CSS configuration files
pnpm exec tailwindcss init -p

# 5. Create the project's directory structure
mkdir -p src/components src/hooks src/services src/store src/workers
```

**Step 1.2: Create the Project README**
Create a new file named `README.md` in the project root (`synestizer_indigo/README.md`) and populate it with the following content:

```markdown
# Synestizer Indigo

Synestizer Indigo is a web-based application that creates sound from live video input, creating a synesthetic experience for the user. This project is a modern, green-field rewrite of an older application, built with a focus on performance, maintainability, and a better developer experience.

## MVP Feature Set

The goal for the Minimum Viable Product (MVP) is to deliver the core synesthesia experience with minimal complexity.

1.  **Video Capture:** Display a live video stream from the user's webcam.
2.  **Basic Feature Extraction:** Analyze the video in real-time to extract a single, simple feature: the overall brightness of the video frame.
3.  **Simple Synthesizer:** Generate a basic synthesized tone.
4.  **Direct Mapping:** Modulate a parameter of the synthesizer (e.g., its frequency) based on the extracted brightness value.
5.  **Core Controls:** A simple UI with a button to start and stop the audio-visual experience.

## Technology Stack

*   **Build Tool:** Vite
*   **Frontend Framework:** React (with Hooks)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **State Management:** Zustand
*   **Audio Synthesis:** Tone.js
*   **Video Processing:** Offloaded to a Web Worker to ensure a non-blocking UI.
*   **Package Manager:** pnpm
```

**Step 1.3: Configure Tailwind CSS**
Replace the entire content of `tailwind.config.js` with the following to configure content paths:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Step 1.4: Add Tailwind CSS Directives**
Replace the entire content of `src/index.css` with the following to include Tailwind's base styles:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

### **Phase 2: Building the Static UI Shell**

**Goal:** Create and assemble the core React components for the application's user interface. At the end of this phase, the UI will be visible but not yet interactive.

**Step 2.1: Create the Header Component**
Create a new file at `src/components/Header.tsx` with the following content:

```typescript
export function Header() {
  return (
    <header className="bg-gray-900 text-white p-4 border-b border-gray-700">
      <h1 className="text-2xl font-bold">Synestizer Indigo</h1>
    </header>
  );
}
```

**Step 2.2: Create the Video Feed Component**
Create a new file at `src/components/VideoFeed.tsx`. This will contain the video element.

```typescript
export function VideoFeed() {
  return (
    <div className="bg-black aspect-video w-full max-w-4xl rounded-lg shadow-lg overflow-hidden">
      <video className="w-full h-full object-cover" autoPlay playsInline muted />
      {/* The video element is muted by default to prevent audio feedback. Sound will be generated by Tone.js. */}
    </div>
  );
}
```

**Step 2.3: Create the Controls Component**
Create a new file at `src/components/Controls.tsx`. This will hold the main start/stop button.

```typescript
export function Controls() {
  return (
    <div className="mt-4">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-lg">
        Start
      </button>
    </div>
  );
}
```

**Step 2.4: Assemble the UI in the Main App Component**
Replace the entire content of `src/App.tsx` to import and render the new components, creating the main application layout.

```typescript
import { Header } from './components/Header';
import { VideoFeed } from './components/VideoFeed';
import { Controls } from './components/Controls';

function App() {
  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <VideoFeed />
        <Controls />
      </main>
    </div>
  );
}

export default App;
```

---

### **Phase 3: State Management and Service Integration**

**Goal:** Introduce a state management solution (Zustand) and an audio service to make the UI interactive.

**Step 3.1: Create the Zustand Store**
Create a new file at `src/store/useAppStore.ts`. This store will manage the application's central state.

```typescript
import { create } from 'zustand';

interface AppState {
  isAudioRunning: boolean;
  startAudio: () => void;
  stopAudio: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAudioRunning: false,
  startAudio: () => set({ isAudioRunning: true }),
  stopAudio: () => set({ isAudioRunning: false }),
}));
```

**Step 3.2: Create the Audio Service**
Create a new file at `src/services/audioService.ts`. This service will encapsulate all audio-related logic. For now, it will simply log to the console.

```typescript
import * as Tone from 'tone';

class AudioService {
  private isStarted = false;

  public async start() {
    if (this.isStarted) return;
    // Tone.start() must be called after a user interaction
    await Tone.start();
    console.log("AudioContext started");
    this.isStarted = true;
    console.log("Audio service started");
  }

  public stop() {
    if (!this.isStarted) return;
    console.log("Audio service stopped");
    // In the future, this will stop the synthesizer
  }
}

export const audioService = new AudioService();
```

**Step 3.3: Connect the Store to the Audio Service**
Modify `src/store/useAppStore.ts` to call the `audioService` when its actions are triggered.

```typescript
import { create } from 'zustand';
import { audioService } from '../services/audioService';

interface AppState {
  isAudioRunning: boolean;
  startAudio: () => void;
  stopAudio: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAudioRunning: false,
  startAudio: () => {
    audioService.start();
    set({ isAudioRunning: true });
  },
  stopAudio: () => {
    audioService.stop();
    set({ isAudioRunning: false });
  },
}));
```

**Step 3.4: Make the Controls Component Interactive**
Finally, update `src/components/Controls.tsx` to use the Zustand store, making the button dynamic and functional.

```typescript
import { useAppStore } from '../store/useAppStore';

export function Controls() {
  const { isAudioRunning, startAudio, stopAudio } = useAppStore();

  const handleToggleAudio = () => {
    if (isAudioRunning) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleToggleAudio}
        className={`font-bold py-2 px-6 rounded text-lg transition-colors ${
          isAudioRunning
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-green-600 hover:bg-green-700'
        } text-white`}
      >
        {isAudioRunning ? 'Stop' : 'Start'}
      </button>
    </div>
  );
}
```

---

This completes the first three phases. After executing all steps, you will have a running React application with a defined UI and state management. The "Start" button will now toggle the application's state and log messages from the audio service to the developer console. The next major phase would be to implement the webcam video capture.