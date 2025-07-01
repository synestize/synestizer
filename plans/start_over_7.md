

### Diagnosis of the Bug: Flawed Mapping Logic

The core issue is in `src/services/audioService.ts`. The current logic sums the influences from each signal linearly and then clamps the result between -1 and 1.

```typescript
// The flawed logic:
const totalInfluence = ...reduce((acc, signal) => {
    return acc + (signalValue * mapping.scale) + mapping.bias;
}, 0);
const clamped = Math.max(-1, Math.min(1, totalInfluence));
```

This has two problems:
1.  **Linear Summation with Hard Clipping:** If you map `brightness` with a scale of `1.0` and `red` with a scale of `1.0`, their combined influence can easily exceed `1.0`, but it gets hard-clipped. This is why adding more scaled signals seems to have a diminishing effect—they just push the value against the `1.0` ceiling.
2.  **Bias Inside the Loop:** The `bias` for each signal is being added inside the `reduce` loop. This is technically correct if each mapping is treated as a separate mini-formula, but it's not the most robust way to calculate a final value.

The original `synestizer-blue` used a much more elegant approach (found in its `transform.js` library): it used a `tanh` function to *saturate* the combined signals. This means that as you add more influence, the output value smoothly approaches +/- 1 but never clips, preserving the nuance of multiple inputs.

We need to fix our `audioService` to correctly sum all the influences *before* applying a single, non-linear saturation function.

---

### Worksheet for Bug Fix

**Objective:** To correct the mapping logic in the `audioService` to properly combine multiple signal influences and to make the `scale` parameter behave as expected.

**Action 1: Rework the `audioService.update` Method**
Modify `src/services/audioService.ts` to separate the `scale` and `bias` calculations and use `Math.tanh()` for a smooth saturation curve.

```typescript
// src/services/audioService.ts
import * as Tone from 'tone';
import { useAppStore, type SignalName } from '../store/useAppStore';

class AudioService {
  private isStarted = false;
  private synth: Tone.Synth | null = null;
  private filter: Tone.Filter | null = null;

  public async start() {
    if (this.isStarted) return;
    await Tone.start();

    this.synth = new Tone.Synth();
    this.filter = new Tone.Filter(1000, "lowpass").toDestination();
    this.synth.connect(this.filter);

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

  public update(signals: Record<SignalName, number>) {
    if (!this.isStarted || !this.synth || !this.filter) return;

    const allMappings = useAppStore.getState().mappings;

    // --- Correctly Calculate Final Parameter Values ---
    const calculateTotalInfluence = (parameter: 'frequency' | 'filterCutoff'): number => {
      const paramMappings = allMappings[parameter] || {};

      let totalScaledInfluence = 0;
      let totalBias = 0;

      for (const signalName in paramMappings) {
        const mapping = paramMappings[signalName as SignalName];
        if (!mapping) continue;

        const signalValue = signals[signalName as SignalName] || 0;

        // Sum scaled signals and biases separately
        totalScaledInfluence += signalValue * mapping.scale;
        totalBias += mapping.bias;
      }

      // Combine and then saturate using tanh for a smooth, non-clipping result
      return Math.tanh(totalScaledInfluence + totalBias);
    };

    const frequencyInfluence = calculateTotalInfluence('frequency');
    const filterInfluence = calculateTotalInfluence('filterCutoff');

    // Map the saturated influence (-1 to 1) to the desired audio range (0 to 1)
    const frequencyValue = (frequencyInfluence + 1) / 2; // to [0, 1] range
    const filterValue = (filterInfluence + 1) / 2;     // to [0, 1] range

    const frequency = frequencyValue * 1200 + 200;   // Map to 200-1400 Hz
    const filterCutoff = filterValue * 6000 + 400; // Map to 400-6400 Hz

    // --- Apply to Synth ---
    this.synth.setNote(frequency);
    this.filter.frequency.rampTo(filterCutoff, 0.05);
  }
}

export const audioService = new AudioService();

```

**Action 2: Validate the Fix**
Run the same tests from the previous step. The "Complex Mapping" test case should now work as expected. You will notice that the `scale` sliders now have a much more significant and interactive effect on the sound, and combining multiple signals results in a more natural blend rather than a hard limit.
