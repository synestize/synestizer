
Our MVP successfully established the core high-performance architecture. Now, we can build upon that foundation to re-introduce the expressiveness of the original, starting with the most impactful features.

The most logical progression is:
1.  **Extract More Signals:** Move beyond simple brightness to extract color information, creating a richer palette of data from the video stream.
2.  **Introduce a Mapping System:** Create a flexible way for the user to connect these new signals to different sound parameters.
3.  **Enhance the Synthesizer:** Add more parameters to the synthesizer (like a filter) to give the user more destinations (sinks) for their signals.

Here is a new worksheet for your AI assistant to implement these features.

---

### **Worksheet for Next Steps: Signal Generation and Mapping**

**Objective:** To evolve the MVP from a single-signal, single-parameter application into a multi-signal system with a user-configurable mapping UI and a more complex synthesizer.

---

### **Phase 5: Advanced Feature Extraction**

**Goal:** Replicate the basic color analysis from `synestizer-blue`. The worker will be updated to calculate not just brightness, but also the average "redness" and "blueness" of the video frame.

**Analysis of `synestizer-blue`:** The file `src/io/video/statModels.js` shows that the old app performed an RGB-to-YCbCr conversion to separate brightness (Luma, or 'Y') from color information (Chroma, or 'Cb' and 'Cr'). We will implement a simplified version of this.

**Action 5.1: Enhance the `featureExtractor.worker.ts`**
Modify the worker to calculate and return three values: brightness, red, and blue.

```typescript
// src/workers/featureExtractor.worker.ts

self.onmessage = (event: MessageEvent<ImageData>) => {
  const imageData = event.data;
  const data = imageData.data;
  let totalBrightness = 0;
  let totalRed = 0;
  let totalBlue = 0;
  const pixelCount = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // RGB to Brightness (Luma) and simplified Chroma
    totalBrightness += (r * 0.299 + g * 0.587 + b * 0.114);
    totalRed += Math.max(0, r - (g + b) / 2); // Measures redness vs the average of green/blue
    totalBlue += Math.max(0, b - (r + g) / 2); // Measures blueness vs the average of red/green
  }

  // Normalize all values to a 0-1 range
  const avgBrightness = (totalBrightness / pixelCount) / 255;
  const avgRed = (totalRed / pixelCount) / 128; // Heuristic normalization
  const avgBlue = (totalBlue / pixelCount) / 128; // Heuristic normalization

  // Post the result object back to the main thread
  self.postMessage({
    brightness: avgBrightness,
    red: avgRed,
    blue: avgBlue
  });
};
```

**Action 5.2: Update the `useWebcam` Hook's Bridge**
Modify the `onmessage` handler in `src/hooks/useWebcam.ts` to accept the new data object and pass it directly to the `audioService`.

```typescript
// src/hooks/useWebcam.ts

// ... inside the useWebcam hook ...

      // Handle messages from worker
      workerRef.current.onmessage = (event: MessageEvent<{ brightness: number; red: number; blue: number }>) => {
        // The entire data object is passed directly to the audio service.
        // This maintains the performance architecture: no React state is involved here.
        audioService.update(event.data);
      };

// ... rest of the hook
```

**Action 5.3: Update the `audioService` to Accept the New Data Structure**
Modify `src/services/audioService.ts` so its `update` method can receive the new object. For now, it will still only use the brightness value, but this prepares it for the next phase.

```typescript
// src/services/audioService.ts

// ... inside the AudioService class ...

  // This method will be called directly with high-frequency data
  public update(signals: { brightness: number; red: number; blue: number }) {
    if (!this.isStarted || !this.synth) return;

    // For now, we only use brightness. The others are ignored but available.
    const { brightness } = signals;

    // Map brightness (0-1) to a musical frequency range (e.g., 200Hz to 800Hz)
    const frequency = brightness * 600 + 200;
    this.synth.setNote(frequency);
  }

// ... rest of the class
```

---

### **Phase 6: UI for Signal Mapping & Enhanced Synthesizer**

**Goal:** Create a simple UI that allows the user to map the new `brightness`, `red`, and `blue` signals to different parameters of an enhanced synthesizer.

**Action 6.1: Enhance the Synthesizer in `audioService.ts`**
Add a `Tone.Filter` to the synthesizer chain. This gives us a new controllable parameter: `filter.frequency`.

```typescript
// src/services/audioService.ts
import * as Tone from 'tone';
import { useAppStore } from '../store/useAppStore'; // We need access to the store for mappings

class AudioService {
  private isStarted = false;
  private synth: Tone.Synth | null = null;
  private filter: Tone.Filter | null = null; // Add a filter

  public async start() {
    if (this.isStarted) return;
    await Tone.start();

    this.synth = new Tone.Synth();
    this.filter = new Tone.Filter(1000, "lowpass").toDestination(); // Initialize filter
    this.synth.connect(this.filter); // Connect synth through the filter

    this.synth.triggerAttack("C4");
    console.log("Audio service started with synth and filter.");
    this.isStarted = true;
  }

  public stop() {
    if (!this.isStarted || !this.synth) return;
    this.synth.triggerRelease();
    this.synth = null;
    this.filter = null;
    this.isStarted = false;
    console.log("Audio service stopped.");
  }

  public update(signals: { brightness: number; red: number; blue: number }) {
    if (!this.isStarted || !this.synth || !this.filter) return;

    // Get the current mapping configuration from the Zustand store
    const mappings = useAppStore.getState().mappings;

    // Map parameters based on the user's chosen configuration
    const frequencySignalValue = signals[mappings.frequency];
    const filterCutoffSignalValue = signals[mappings.filterCutoff];

    const frequency = frequencySignalValue * 600 + 200; // Map signal to pitch
    const filterCutoff = filterCutoffSignalValue * 4000 + 400; // Map signal to filter cutoff

    this.synth.setNote(frequency);
    this.filter.frequency.rampTo(filterCutoff, 0.05); // Ramp to the new cutoff
  }
}

export const audioService = new AudioService();
```

**Action 6.2: Update the Application State in `useAppStore.ts`**
Add the `mappings` configuration to our Zustand store.

```typescript
// src/store/useAppStore.ts
import { create } from 'zustand';
import { audioService } from '../services/audioService';

// Define the types for our signals and parameters
export type SignalName = 'brightness' | 'red' | 'blue';
export type ParameterName = 'frequency' | 'filterCutoff';

interface AppState {
  isAudioRunning: boolean;
  mappings: Record<ParameterName, SignalName>;
  startAudio: () => void;
  stopAudio: () => void;
  setMapping: (parameter: ParameterName, signal: SignalName) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAudioRunning: false,
  // Default mapping on startup
  mappings: {
    frequency: 'brightness',
    filterCutoff: 'blue',
  },
  startAudio: () => {
    audioService.start();
    set({ isAudioRunning: true });
  },
  stopAudio: () => {
    audioService.stop();
    set({ isAudioRunning: false });
  },
  setMapping: (parameter, signal) => {
    set((state) => ({
      mappings: {
        ...state.mappings,
        [parameter]: signal,
      },
    }));
  },
}));
```

**Action 6.3: Create the Mapping UI Component**
Create a new file at `src/components/MappingControls.tsx`. This component will render dropdowns for the user to configure the signal mappings.

```typescript
// src/components/MappingControls.tsx
import { useAppStore, ParameterName, SignalName } from '../store/useAppStore';

const signals: SignalName[] = ['brightness', 'red', 'blue'];
const parameters: ParameterName[] = ['frequency', 'filterCutoff'];

export function MappingControls() {
  const { mappings, setMapping } = useAppStore();

  return (
    <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold mb-2 text-center">Signal Mappings</h3>
      <div className="grid grid-cols-2 gap-4">
        {parameters.map((param) => (
          <div key={param} className="flex flex-col items-center">
            <label htmlFor={param} className="capitalize text-sm mb-1 text-gray-300">
              {param === 'frequency' ? 'Pitch' : 'Filter'}
            </label>
            <select
              id={param}
              value={mappings[param]}
              onChange={(e) => setMapping(param, e.target.value as SignalName)}
              className="bg-gray-800 border border-gray-600 rounded px-2 py-1"
            >
              {signals.map((signal) => (
                <option key={signal} value={signal} className="capitalize">
                  {signal}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Action 6.4: Integrate the New Component into `App.tsx`**
Add the `<MappingControls />` component to the main application UI.

```typescript
// src/App.tsx

import { Header } from './components/Header';
import { VideoFeed } from './components/VideoFeed';
import { Controls } from './components/Controls';
import { useWebcam } from './hooks/useWebcam';
import { useAppStore } from './store/useAppStore';
import { useEffect } from 'react';
import { MappingControls } from './components/MappingControls'; // Import the new component

function App() {
  const { videoRef, canvasRef, error, startWebcam, stopWebcam } = useWebcam();
  const { isAudioRunning } = useAppStore();

  useEffect(() => {
    if (isAudioRunning) {
      startWebcam();
    } else {
      stopWebcam();
    }
  }, [isAudioRunning, startWebcam, stopWebcam]);

  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <VideoFeed videoRef={videoRef} />
        <Controls />
        <MappingControls /> {/* Add the mapping controls to the UI */}
        {error && <div className="mt-4 p-2 bg-red-800 text-white rounded">{error}</div>}
      </main>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
```

---

### Testing and Validation Plan

After the AI assistant completes these actions, perform the following tests:

**Test Case 1: UI and Default State**
1.  Run the application.
2.  **Expected Result:** You should see the new "Signal Mappings" panel. The "Pitch" dropdown should have "brightness" selected, and the "Filter" dropdown should have "blue" selected, as per our defaults.

**Test Case 2: End-to-End Functionality Test**
1.  Start the application.
2.  Hold a bright white object (like a phone screen) in front of the camera.
3.  **Expected Result:** The pitch of the sound should increase.
4.  Now, hold a distinctly blue object in front of the camera.
5.  **Expected Result:** The sound should change in timbre, becoming brighter or duller as the filter cutoff frequency changes. The pitch should not be significantly affected.

**Test Case 3: Re-mapping Test**
1.  In the "Signal Mappings" UI, change the "Pitch" dropdown to "red" and the "Filter" dropdown to "brightness".
2.  Hold a distinctly red object in front of the camera.
3.  **Expected Result:** The **pitch** of the sound should now change.
4.  Now, hold the bright white object in front of the camera again.
5.  **Expected Result:** The **timbre** of the sound (the filter) should now change. The pitch should not be significantly affected.

Passing these tests will confirm that the new signals are being generated correctly and that the user-configurable mapping system is successfully controlling the enhanced synthesizer.