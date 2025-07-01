
### Worksheet for Next Steps: The Mapping Matrix

**Objective:** To replace the simple 1-to-1 dropdown mapping with a powerful, many-to-many matrix system. This will allow any signal to influence any parameter with a user-defined **scale** (how much influence) and **bias** (a static offset). This is the true core of the original application's creative potential.

---

#### **Phase 7: Evolving the State for Advanced Mapping**

**Goal:** Update our state management to store a `scale` and `bias` for every possible signal-parameter intersection, not just a single selection.

**Action 7.1: Restructure the `useAppStore.ts` State**
We will change the `mappings` state from a simple record to a nested object structure: `{[parameter]: {[signal]: {scale: number, bias: number}}}`.

```typescript
// src/store/useAppStore.ts
import { create } from 'zustand';
import { audioService } from '../services/audioService';

export type SignalName = 'brightness' | 'red' | 'blue';
export type ParameterName = 'frequency' | 'filterCutoff';

// This is the new shape for a single mapping cell
export interface MappingValue {
  scale: number;
  bias: number;
}

// The new state shape for all mappings
type Mappings = Record<ParameterName, Partial<Record<SignalName, MappingValue>>>;

interface AppState {
  isAudioRunning: boolean;
  mappings: Mappings;
  startAudio: () => void;
  stopAudio: () => void;
  setMappingValue: (parameter: ParameterName, signal: SignalName, value: Partial<MappingValue>) => void;
}

// Helper to create a default, empty mapping object for a signal
const createDefaultMapping = (): MappingValue => ({ scale: 0, bias: 0 });

export const useAppStore = create<AppState>((set) => ({
  isAudioRunning: false,
  // Default mapping on startup. Brightness controls pitch, Blue controls filter.
  mappings: {
    frequency: {
      brightness: { scale: 1, bias: 0 },
    },
    filterCutoff: {
      blue: { scale: 1, bias: 0 },
    },
  },
  startAudio: () => {
    audioService.start();
    set({ isAudioRunning: true });
  },
  stopAudio: () => {
    audioService.stop();
    set({ isAudioRunning: false });
  },
  setMappingValue: (parameter, signal, value) => {
    set((state) => {
      const newMappings = { ...state.mappings };
      // Ensure the nested objects exist before updating
      if (!newMappings[parameter]) newMappings[parameter] = {};
      const currentMapping = newMappings[parameter][signal] || createDefaultMapping();

      newMappings[parameter][signal] = { ...currentMapping, ...value };

      return { mappings: newMappings };
    });
  },
}));
```

---

#### **Phase 8: Implementing Many-to-Many Logic**

**Goal:** Update the `audioService` to calculate the final value for each parameter by summing the contributions of all signals mapped to it.

**Action 8.1: Rework the `audioService.update` Method**
This is the most critical logic change. The method must now iterate through all possible signals for each parameter and apply their respective `scale` and `bias`.

```typescript
// src/services/audioService.ts
import * as Tone from 'tone';
import { useAppStore, SignalName } from '../store/useAppStore';

// ... (keep the class and start/stop methods as they are) ...
class AudioService {
  // ... start, stop, synth, filter ...

  public update(signals: Record<SignalName, number>) {
    if (!this.isStarted || !this.synth || !this.filter) return;

    const allMappings = useAppStore.getState().mappings;

    // --- Calculate Frequency ---
    const frequencyMappings = allMappings.frequency || {};
    const totalFrequencyInfluence = Object.keys(frequencyMappings).reduce((acc, signal) => {
      const mapping = frequencyMappings[signal as SignalName];
      if (!mapping) return acc;

      const signalValue = signals[signal as SignalName] || 0;
      // Accumulate scaled signal values and biases
      return acc + (signalValue * mapping.scale) + mapping.bias;
    }, 0);

    // Clamp the final influence to a -1 to 1 range before mapping to audio units
    const clampedFrequency = Math.max(-1, Math.min(1, totalFrequencyInfluence));
    const frequency = (clampedFrequency + 1) / 2 * 1200 + 200; // Map range 0-1 to 200-1400 Hz

    // --- Calculate Filter Cutoff ---
    const filterMappings = allMappings.filterCutoff || {};
    const totalFilterInfluence = Object.keys(filterMappings).reduce((acc, signal) => {
      const mapping = filterMappings[signal as SignalName];
      if (!mapping) return acc;

      const signalValue = signals[signal as SignalName] || 0;
      return acc + (signalValue * mapping.scale) + mapping.bias;
    }, 0);

    const clampedFilter = Math.max(-1, Math.min(1, totalFilterInfluence));
    const filterCutoff = (clampedFilter + 1) / 2 * 6000 + 400; // Map range 0-1 to 400-6400 Hz

    // --- Apply to Synth ---
    this.synth.setNote(frequency);
    this.filter.frequency.rampTo(filterCutoff, 0.05);
  }
}

export const audioService = new AudioService();
```

---

#### **Phase 9: Building the Mapping Matrix UI**

**Goal:** Replace the simple dropdown controls with a matrix UI that has sliders for `scale` and `bias` at each intersection.

**Action 9.1: Create the `MappingMatrix.tsx` Component**
This new component will be the main interface for sound design.

```typescript
// src/components/MappingMatrix.tsx
import { useAppStore, ParameterName, SignalName, MappingValue } from '../store/useAppStore';

const signals: SignalName[] = ['brightness', 'red', 'blue'];
const parameters: ParameterName[] = ['frequency', 'filterCutoff'];

// A single cell in our matrix
function MappingCell({ parameter, signal }: { parameter: ParameterName; signal: SignalName }) {
  const { mappings, setMappingValue } = useAppStore();
  const mapping = mappings[parameter]?.[signal] || { scale: 0, bias: 0 };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMappingValue(parameter, signal, { scale: parseFloat(e.target.value) });
  };

  const handleBiasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMappingValue(parameter, signal, { bias: parseFloat(e.target.value) });
  };

  return (
    <div className="bg-gray-800 p-2 rounded">
      <div className="flex items-center justify-between text-xs">
        <label htmlFor={`${parameter}-${signal}-scale`}>Scale</label>
        <span className="font-mono">{mapping.scale.toFixed(2)}</span>
      </div>
      <input
        type="range"
        id={`${parameter}-${signal}-scale`}
        min="-1"
        max="1"
        step="0.05"
        value={mapping.scale}
        onChange={handleScaleChange}
        className="w-full h-1"
      />
      <div className="flex items-center justify-between text-xs mt-2">
        <label htmlFor={`${parameter}-${signal}-bias`}>Bias</label>
        <span className="font-mono">{mapping.bias.toFixed(2)}</span>
      </div>
      <input
        type="range"
        id={`${parameter}-${signal}-bias`}
        min="-1"
        max="1"
        step="0.05"
        value={mapping.bias}
        onChange={handleBiasChange}
        className="w-full h-1"
      />
    </div>
  );
}

export function MappingMatrix() {
  return (
    <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-inner w-full max-w-4xl">
      <h3 className="text-lg font-semibold mb-3 text-center">Mapping Matrix</h3>
      <div className="grid grid-cols-4 gap-2 text-center items-center">
        <div /> {/* Empty corner */}
        {signals.map(s => <div key={s} className="capitalize font-bold text-gray-300">{s}</div>)}

        {parameters.map(p => (
          <>
            <div key={p} className="capitalize font-bold text-gray-300 text-right pr-2">
              {p === 'frequency' ? 'Pitch' : 'Filter'}
            </div>
            {signals.map(s => <MappingCell key={`${p}-${s}`} parameter={p} signal={s} />)}
          </>
        ))}
      </div>
    </div>
  );
}
```

**Action 9.2: Update `App.tsx` to Use the New Matrix**
Replace `<MappingControls />` with `<MappingMatrix />`.

```typescript
// src/App.tsx
// ... (imports) ...
import { MappingMatrix } from './components/MappingMatrix'; // Import the new component

function App() {
  // ... (hooks and useEffect remain the same) ...

  return (
    <div className="bg-gray-800 text-white min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <VideoFeed videoRef={videoRef} />
        <Controls />
        <MappingMatrix /> {/* Replace the old controls with the new matrix */}
        {error && <div className="mt-4 p-2 bg-red-800 text-white rounded">{error}</div>}
      </main>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default App;
```

**Action 9.3: Remove the Old `MappingControls.tsx`**
The file `src/components/MappingControls.tsx` is now obsolete and can be safely deleted.

---

### Testing and Validation Plan

**Test Case 1: Complex Mapping**
1.  Start the application.
2.  In the matrix, find the cell where "Pitch" (frequency) intersects with "brightness". Set its `scale` slider to `1.0`.
3.  Find the cell where "Pitch" intersects with "red". Set its `scale` slider to `0.5`.
4.  Hold a very red object in front of the camera. The pitch should rise.
5.  Now, while keeping the red object, shine a bright white light as well.
6.  **Expected Result:** The pitch should rise *even higher* than it did with just the red object, confirming that the influences from brightness and red are being summed.

**Test Case 2: Negative Scaling**
1.  Reset the mapping from the previous test (or reload the page).
2.  Map "Pitch" to "brightness" with a `scale` of `-1.0`.
3.  **Expected Result:** As the view gets brighter, the pitch should now *decrease*. This confirms negative scaling works.

**Test Case 3: Bias Control**
1.  Set the `scale` for all mappings for "Pitch" to `0.0`.
2.  Set the `bias` for the "Pitch" -> "brightness" cell to `0.5`.
3.  **Expected Result:** The pitch should jump to a high, static value and *not* change when the video input changes. This confirms the bias is working independently.