

### **Worksheet for Next Steps: Multi-Voice Synthesizer**

**Objective:** To expand the audio engine to support two distinct voices and update the state management and UI to control them independently via the mapping matrix.

---

#### **Phase 10: State and Audio Engine Expansion**

**Goal:** Refactor the `audioService` to manage two separate synth voices and update the `useAppStore` to define parameters for both.

**Action 10.1: Expand the State in `useAppStore.ts`**
We need to introduce new parameters for the second voice. We'll prefix them to keep them organized.

```typescript
// src/store/useAppStore.ts
import { create } from 'zustand';
import { audioService } from '../services/audioService';

// Add new parameters for voice2
export type SignalName = 'brightness' | 'red' | 'blue';
export type ParameterName =
  | 'voice1_frequency'
  | 'voice1_filterCutoff'
  | 'voice2_frequency'
  | 'voice2_filterCutoff';

export interface MappingValue {
  scale: number;
  bias: number;
}

type Mappings = Record<ParameterName, Partial<Record<SignalName, MappingValue>>>;

interface AppState {
  isAudioRunning: boolean;
  mappings: Mappings;
  startAudio: () => void;
  stopAudio: () => void;
  setMappingValue: (parameter: ParameterName, signal: SignalName, value: Partial<MappingValue>) => void;
}

const createDefaultMapping = (): MappingValue => ({ scale: 0, bias: 0 });

export const useAppStore = create<AppState>((set) => ({
  isAudioRunning: false,
  // Update default mappings to control both voices distinctly
  mappings: {
    voice1_frequency: { brightness: { scale: 1, bias: 0 } },
    voice1_filterCutoff: { red: { scale: 1, bias: 0 } },
    voice2_frequency: { blue: { scale: 1, bias: 0 } },
    voice2_filterCutoff: { brightness: { scale: -1, bias: 0 } }, // Invert for variety
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
      if (!newMappings[parameter]) newMappings[parameter] = {};
      const currentMapping = newMappings[parameter][signal] || createDefaultMapping();
      newMappings[parameter][signal] = { ...currentMapping, ...value };
      return { mappings: newMappings };
    });
  },
}));
```

**Action 10.2: Implement a Multi-Voice `audioService`**
This is the core of the change. We will instantiate two synth/filter chains and create a helper function to avoid duplicating the mapping logic.

```typescript
// src/services/audioService.ts
import * as Tone from 'tone';
import { useAppStore, type SignalName, type ParameterName } from '../store/useAppStore';

class AudioService {
  private isStarted = false;
  // Voice 1 components
  private synth1: Tone.Synth | null = null;
  private filter1: Tone.Filter | null = null;
  // Voice 2 components
  private synth2: Tone.Synth | null = null;
  private filter2: Tone.Filter | null = null;

  public async start() {
    if (this.isStarted) return;
    await Tone.start();

    // --- Voice 1 Setup (Triangle Wave) ---
    this.synth1 = new Tone.Synth({ oscillator: { type: 'triangle' } });
    this.filter1 = new Tone.Filter(1000, "lowpass").toDestination();
    this.synth1.connect(this.filter1);
    this.synth1.triggerAttack("C4");

    // --- Voice 2 Setup (Square Wave for distinction) ---
    this.synth2 = new Tone.Synth({ oscillator: { type: 'square' } });
    this.filter2 = new Tone.Filter(1000, "lowpass").toDestination();
    this.synth2.connect(this.filter2);
    this.synth2.triggerAttack("C3"); // Start an octave lower

    console.log("Audio service started with two voices.");
    this.isStarted = true;
  }

  public stop() {
    if (!this.isStarted) return;
    this.synth1?.triggerRelease();
    this.synth2?.triggerRelease();
    this.synth1 = null;
    this.filter1 = null;
    this.synth2 = null;
    this.filter2 = null;
    this.isStarted = false;
    console.log("Audio service stopped.");
  }

  // Helper function to calculate the combined influence for any parameter
  private calculateTotalInfluence(
    parameter: ParameterName,
    signals: Record<SignalName, number>,
    allMappings: ReturnType<typeof useAppStore.getState>['mappings']
  ): number {
    const paramMappings = allMappings[parameter] || {};
    let totalScaledInfluence = 0;
    let totalBias = 0;

    for (const signalName in paramMappings) {
      const mapping = paramMappings[signalName as SignalName];
      if (!mapping) continue;
      const signalValue = signals[signalName as SignalName] || 0;
      totalScaledInfluence += signalValue * mapping.scale;
      totalBias += mapping.bias;
    }
    return Math.tanh(totalScaledInfluence + totalBias);
  }

  public update(signals: Record<SignalName, number>) {
    if (!this.isStarted || !this.synth1 || !this.filter1 || !this.synth2 || !this.filter2) return;

    const allMappings = useAppStore.getState().mappings;

    // --- Calculate Influences ---
    const v1FreqInfluence = this.calculateTotalInfluence('voice1_frequency', signals, allMappings);
    const v1FilterInfluence = this.calculateTotalInfluence('voice1_filterCutoff', signals, allMappings);
    const v2FreqInfluence = this.calculateTotalInfluence('voice2_frequency', signals, allMappings);
    const v2FilterInfluence = this.calculateTotalInfluence('voice2_filterCutoff', signals, allMappings);

    // --- Map Influences to Audio Values ---
    const v1Freq = (v1FreqInfluence + 1) / 2 * 800 + 200;     // 200-1000 Hz
    const v1Filter = (v1FilterInfluence + 1) / 2 * 4000 + 400;  // 400-4400 Hz
    const v2Freq = (v2FreqInfluence + 1) / 2 * 600 + 100;      // 100-700 Hz
    const v2Filter = (v2FilterInfluence + 1) / 2 * 5000 + 200;  // 200-5200 Hz

    // --- Apply to Synths ---
    this.synth1.frequency.rampTo(v1Freq, 0.05);
    this.filter1.frequency.rampTo(v1Filter, 0.05);
    this.synth2.frequency.rampTo(v2Freq, 0.05);
    this.filter2.frequency.rampTo(v2Filter, 0.05);
  }
}

export const audioService = new AudioService();
```

---

#### **Phase 11: Updating the UI for Multiple Voices**

**Goal:** Modify the `MappingMatrix` to display the new parameters for both voices, making the UI a true multi-output controller.

**Action 11.1: Update the `MappingMatrix.tsx` Component**
Add the new parameters to the list and use a simple map for user-friendly labels.

```typescript
// src/components/MappingMatrix.tsx
import { useAppStore, type ParameterName, type SignalName } from '../store/useAppStore';

const signals: SignalName[] = ['brightness', 'red', 'blue'];
// Expand the list of parameters to include both voices
const parameters: ParameterName[] = [
  'voice1_frequency',
  'voice1_filterCutoff',
  'voice2_frequency',
  'voice2_filterCutoff'
];

// Map internal parameter names to user-friendly labels
const parameterLabels: Record<ParameterName, string> = {
  voice1_frequency: 'Voice 1 Pitch',
  voice1_filterCutoff: 'Voice 1 Filter',
  voice2_frequency: 'Voice 2 Pitch',
  voice2_filterCutoff: 'Voice 2 Filter',
};

// A single cell in our matrix (no changes needed here)
function MappingCell({ parameter, signal }: { parameter: ParameterName; signal: SignalName }) {
  // ... this component remains the same
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
              {/* Use the label map for display */}
              {parameterLabels[p]}
            </div>
            {signals.map(s => <MappingCell key={`${p}-${s}`} parameter={p} signal={s} />)}
          </>
        ))}
      </div>
    </div>
  );
}
```

---

### Testing and Validation Plan

**Test Case 1: Independent Voice Control**
1.  Start the application. Two distinct sounds should be audible (a triangle wave and a square wave).
2.  In the matrix, set the `scale` for **all** `Voice 2` parameters to `0`.
3.  Modify the `scale` sliders for `Voice 1 Pitch` and `Voice 1 Filter`.
4.  **Expected Result:** Only the pitch and timbre of the triangle wave should change. The square wave sound should remain static.

**Test Case 2: Cross-Control Verification**
1.  Reset the mappings (reload the page).
2.  Set the `scale` for `Voice 1 Pitch` -> `brightness` to `1.0`.
3.  Set the `scale` for `Voice 2 Pitch` -> `red` to `1.0`.
4.  Hold a bright white object in front of the camera.
5.  **Expected Result:** The pitch of the **triangle wave** (Voice 1) should increase. The square wave should be unaffected.
6.  Now, hold a bright red object in front of the camera.
7.  **Expected Result:** The pitch of the **square wave** (Voice 2) should increase. The triangle wave should be unaffected. This confirms that signals are being routed correctly to their independent synth voices.