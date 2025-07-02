
### **Worksheet for Next Steps: Advanced Video Signal Analysis**

**Objective:** To replace the simple brightness/red/blue analysis with a robust statistical model based on the YCbCr color space and spatial covariance, mirroring the core logic of `synestizer-blue`.

---

#### **Phase 14: Overhauling the Feature Extraction Worker**

**Goal:** Completely replace the logic in `featureExtractor.worker.ts` with a new model that calculates mean, variance, and spatial/chroma correlations.

**Analysis of `synestizer-blue`:** The `Moment` function in `src/io/video/statModels.js` is our blueprint. It does the following:
1.  Converts RGB to a Luma/Chroma color space (Y, Cb, Cr).
2.  Calculates the raw sums (1st-order moments) for each component and its product with spatial coordinates (x, y).
3.  Calculates the central moments (variance and covariance).
4.  Normalizes the covariances into correlation coefficients, which are stable signals between -1 and 1.

We will replicate this entire pipeline.

**Action 14.1: Replace the Logic in `featureExtractor.worker.ts`**
The current worker is simple. We will replace its contents entirely with this new, more sophisticated version. This is the most significant part of this plan.

```typescript
// src/workers/featureExtractor.worker.ts

// --- State stored within the worker's scope ---
let lastSignals: Record<string, number> = {};
let lastProcessTime = 0;

// Helper function for statistical normalization
const stdev = (variance: number) => Math.sqrt(Math.max(0, variance));

self.onmessage = (event: MessageEvent<ImageData>) => {
  const { data, width, height } = event.data;
  const pixelCount = width * height;

  // --- 1. Raw Moment Calculation ---
  // These will store the sums of various values over all pixels.
  const sums = {
    y: 0, cb: 0, cr: 0, // Mean values for Y, Cb, Cr
    x_y: 0, x_cb: 0, x_cr: 0, // Spatial correlation with X
    y_y: 0, y_cb: 0, y_cr: 0, // Covariance between channels
    y_x: 0, cb_x: 0, cr_x: 0, // Spatial correlation with Y (same as x_y etc, but good to be explicit)
    cb_cb: 0, cb_cr: 0,
    cr_cr: 0,
  };

  for (let i = 0; i < pixelCount; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];

    // --- RGB to YCbCr conversion (approximated) ---
    const y = 0.299 * r + 0.587 * g + 0.114 * b;
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

    // Spatial coordinates, normalized from 0 to 1
    const xNorm = (i % width) / width;
    const yNorm = Math.floor(i / width) / height;

    // Accumulate sums for calculating means
    sums.y += y;
    sums.cb += cb;
    sums.cr += cr;

    // Accumulate sums for calculating variances
    sums.y_y += y * y;
    sums.cb_cb += cb * cb;
    sums.cr_cr += cr * cr;

    // Accumulate sums for covariances
    sums.y_cb += y * cb;
    sums.y_cr += y * cr;
    sums.cb_cr += cb * cr;
    sums.x_y += xNorm * y;
    sums.x_cb += xNorm * cb;
    sums.x_cr += xNorm * cr;
    sums.y_x += yNorm * y; // Note: 'y_x' here means y-coordinate vs y-luma
    // ... we can add y_cb, y_cr here if we want vertical correlation
  }

  // --- 2. Central Moment Calculation ---
  const means = {
    y: sums.y / pixelCount,
    cb: sums.cb / pixelCount,
    cr: sums.cr / pixelCount,
    x: 0.5, // The mean of a uniform distribution from 0 to 1
    y_coord: 0.5,
  };

  const variances = {
    y: (sums.y_y / pixelCount) - (means.y ** 2),
    cb: (sums.cb_cb / pixelCount) - (means.cb ** 2),
    cr: (sums.cr_cr / pixelCount) - (means.cr ** 2),
    x: 1 / 12, // The variance of a uniform distribution from 0 to 1
    y_coord: 1 / 12,
  };

  const covariances = {
    x_y: (sums.x_y / pixelCount) - (means.x * means.y),
    x_cb: (sums.x_cb / pixelCount) - (means.x * means.cb),
    x_cr: (sums.x_cr / pixelCount) - (means.x * means.cr),
    y_y_coord: (sums.y_x / pixelCount) - (means.y_coord * means.y),
    y_cb: (sums.y_cb / pixelCount) - (means.y * means.cb),
    y_cr: (sums.y_cr / pixelCount) - (means.y * means.cr),
    cb_cr: (sums.cb_cr / pixelCount) - (means.cb * means.cr),
  };

  // --- 3. Final Signal Generation & Normalization ---
  // We now have enough to generate a rich set of signals.
  const currentSignals = {
    // Mean Values (normalized)
    brightness: means.y / 255,
    chroma_blue: means.cb / 255,
    chroma_red: means.cr / 255,
    // Variance (normalized standard deviation)
    brightness_variance: stdev(variances.y) / 64, // Heuristic normalization
    chroma_blue_variance: stdev(variances.cb) / 64,
    chroma_red_variance: stdev(variances.cr) / 64,
    // Correlations (inherently -1 to 1, but we scale for sensitivity)
    x_brightness: (covariances.x_y / (stdev(variances.x) * stdev(variances.y))) * 2,
    y_brightness: (covariances.y_y_coord / (stdev(variances.y_coord) * stdev(variances.y))) * 2,
    brightness_blue_corr: (covariances.y_cb / (stdev(variances.y) * stdev(variances.cb))),
  };

  // --- 4. Calculate Deltas ---
  const now = Date.now();
  const deltaTime = (now - lastProcessTime) / 1000.0;
  lastProcessTime = now;
  const deltaSignals = {};
  for (const key in currentSignals) {
    const lastVal = lastSignals[key] || 0;
    const currentVal = currentSignals[key as keyof typeof currentSignals];
    deltaSignals[`${key}_delta`] = Math.max(0, (currentVal - lastVal) / deltaTime) * 5;
  }

  // --- 5. Update state and post ---
  lastSignals = currentSignals;
  self.postMessage({ ...currentSignals, ...deltaSignals });
};
```

---

#### **Phase 15: Integrating the New Signals into the Application**

**Goal:** Update the app's types and UI to reflect the powerful new signal set generated by the worker.

**Action 15.1: Update All Type Definitions**
The `SignalName` type is now much larger. This change needs to be made in `useAppStore.ts`, and the `useWebcam.ts` hook's `onmessage` event type must also be updated to match the new object shape posted by the worker.

```typescript
// src/store/useAppStore.ts
// ... imports ...

// This is our new, much richer, set of signals
export type SignalName =
  | 'brightness' | 'chroma_blue' | 'chroma_red'
  | 'brightness_variance' | 'chroma_blue_variance' | 'chroma_red_variance'
  | 'x_brightness' | 'y_brightness' | 'brightness_blue_corr'
  | 'brightness_delta' | 'chroma_blue_delta' | 'chroma_red_delta'
  | 'brightness_variance_delta' | 'chroma_blue_variance_delta' | 'chroma_red_variance_delta'
  | 'x_brightness_delta' | 'y_brightness_delta' | 'brightness_blue_corr_delta';

// The ParameterName type remains the same
export type ParameterName =
  | 'voice1_frequency' | 'voice1_filterCutoff'
  | 'voice2_frequency' | 'voice2_filterCutoff';

// ... The rest of the store (MappingValue, Mappings, AppState, and the store creator)
// does not need to change, as it's already generic.
// We should update the default mappings to use some of the new signals for a better demo.

// In create<AppState>((set) => ({ ... }))
  // ...
  mappings: {
    voice1_frequency: { brightness: { scale: 1, bias: 0 } },
    voice1_filterCutoff: { brightness_variance: { scale: 1, bias: 0 } },
    voice2_frequency: { x_brightness: { scale: 1, bias: 0 } }, // Pan L-R to change pitch
    voice2_filterCutoff: { brightness_delta: { scale: 1, bias: 0 } }, // Movement opens filter
  },
  // ...
```

**Action 15.2: Update `MappingMatrix.tsx` for a Wider Grid**
The matrix is now very wide. We will adjust the grid and text rotation to accommodate it.

```typescript
// src/components/MappingMatrix.tsx
import React from 'react';
import { useAppStore, type ParameterName, type SignalName } from '../store/useAppStore';

const signals: SignalName[] = [
  'brightness', 'chroma_blue', 'chroma_red',
  'brightness_variance', 'chroma_blue_variance', 'chroma_red_variance',
  'x_brightness', 'y_brightness', 'brightness_blue_corr',
  'brightness_delta', 'chroma_blue_delta', 'chroma_red_delta',
  'brightness_variance_delta', 'chroma_blue_variance_delta', 'chroma_red_variance_delta',
  'x_brightness_delta', 'y_brightness_delta', 'brightness_blue_corr_delta'
];
const parameters: ParameterName[] = [
  'voice1_frequency', 'voice1_filterCutoff',
  'voice2_frequency', 'voice2_filterCutoff'
];
const parameterLabels: Record<ParameterName, string> = { /* ... same as before ... */ };

// ... MappingCell component is unchanged ...

export function MappingMatrix() {
  return (
    <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-inner w-full max-w-7xl overflow-x-auto">
      <h3 className="text-lg font-semibold mb-3 text-center">Mapping Matrix</h3>
      <div
        className="grid gap-2 text-center items-center"
        style={{ gridTemplateColumns: `auto repeat(${signals.length}, 1fr)` }}
      >
        <div /> {/* Empty corner */}
        {signals.map(s => (
          <div key={s} className="h-24 flex items-end justify-center">
            <span className="text-xs font-bold text-gray-300 transform -rotate-65 whitespace-nowrap origin-bottom-left">
              {s.replace(/_/g, ' ')}
            </span>
          </div>
        ))}

        {parameters.map(p => (
          <React.Fragment key={p}>
            <div className="capitalize font-bold text-gray-300 text-right pr-2 whitespace-nowrap">
              {parameterLabels[p]}
            </div>
            {signals.map(s => <MappingCell key={`${p}-${s}`} parameter={p} signal={s} />)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
```

---

### Testing and Validation Plan

**Test Case 1: Testing Spatial Correlation (`x_brightness`)**
1.  Start the application. Set all `scale` values to `0` except for `Voice 1 Pitch` -> `x_brightness`, which you should set to `1.0`.
2.  Hold a bright object (like a phone screen) on the far **left** of the webcam view. Note the pitch.
3.  Slowly move the bright object to the far **right** of the webcam view.
4.  **Expected Result:** The pitch of Voice 1 should smoothly increase as the object moves from left to right. This confirms that the horizontal position of brightness is being correctly calculated and mapped.

**Test Case 2: Testing Variance (`brightness_variance`)**
1.  Reset mappings. Set the `scale` for `Voice 1 Filter` -> `brightness_variance` to `1.0`.
2.  Present a uniform, flat-colored object to the camera (e.g., a piece of paper). The filter should be relatively closed (dull sound).
3.  Present a high-contrast, busy image (e.g., a page of text, a patterned shirt).
4.  **Expected Result:** The filter should open up, making the sound much brighter and buzzier. This confirms that the *amount of detail/contrast* in the image is being correctly measured.

**Test Case 3: Testing Chroma-Luma Correlation (`brightness_blue_corr`)**
1.  Reset mappings. Set `Voice 1 Pitch` -> `brightness_blue_corr` to a `scale` of `1.0`.
2.  Show the camera an image that is blue on one side and black on the other. Note the pitch.
3.  Show the camera an image that is blue on one side and white on the other.
4.  **Expected Result:** The pitch should be very different in these two cases, proving the app is measuring whether blue and bright pixels appear in the *same areas*.