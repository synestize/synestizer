### **Worksheet for Next Steps: Advanced Signal Processing**

**Objective:** To replicate the advanced signal generation from `synestizer-blue` by calculating derivatives (change over time) and power functions for our core video signals. This will transform our signal palette from 3 to 9, unlocking far more dynamic mapping possibilities.

**Analysis of `synestizer-blue`:** The `src/io/video/statModels.js` file generated dozens of signals. We will focus on the most important ones: the raw signals (`brightness`), their change over time (`∆brightness`), and their squared values (`brightness²`).

---

#### **Phase 12: Advanced Signal Generation in the Worker**

**Goal:** Upgrade the `featureExtractor.worker.ts` to be stateful, allowing it to calculate the rate of change (delta) and non-linear powers of the signals.

**Action 12.1: Implement State and Advanced Calculations in `featureExtractor.worker.ts`**
This is the main logic change. The worker needs to remember the previous set of values to calculate the difference.

```typescript
// src/workers/featureExtractor.worker.ts

// State to be stored within the worker's scope
let lastSignals = { brightness: 0, red: 0, blue: 0 };
let lastProcessTime = 0;

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
    totalBrightness += (r * 0.299 + g * 0.587 + b * 0.114);
    totalRed += Math.max(0, r - (g + b) / 2);
    totalBlue += Math.max(0, b - (r + g) / 2);
  }

  // --- 1. Calculate current raw signals ---
  const currentSignals = {
    brightness: (totalBrightness / pixelCount) / 255,
    red: (totalRed / pixelCount) / 128,
    blue: (totalBlue / pixelCount) / 128,
  };

  // --- 2. Calculate delta (derivative) signals ---
  const now = Date.now();
  const deltaTime = (now - lastProcessTime) / 1000.0; // time in seconds
  lastProcessTime = now;

  // Calculate change and normalize by time. The factor of 5 is a sensitivity boost.
  const deltaSignals = {
    brightness_delta: Math.max(0, (currentSignals.brightness - lastSignals.brightness) / deltaTime) * 5,
    red_delta: Math.max(0, (currentSignals.red - lastSignals.red) / deltaTime) * 5,
    blue_delta: Math.max(0, (currentSignals.blue - lastSignals.blue) / deltaTime) * 5,
  };

  // --- 3. Calculate power signals ---
  const powerSignals = {
    brightness_power: currentSignals.brightness ** 2,
    red_power: currentSignals.red ** 2,
    blue_power: currentSignals.blue ** 2,
  };

  // --- 4. Update state for next frame ---
  lastSignals = currentSignals;

  // --- 5. Post all signals back to the main thread ---
  self.postMessage({
    ...currentSignals,
    ...deltaSignals,
    ...powerSignals,
  });
};
```

**Action 12.2: Update the `useWebcam` Hook's Bridge**
Modify the type definition in the `onmessage` handler in `src/hooks/useWebcam.ts` to expect the new, larger signal object. The logic inside the handler remains identical.

```typescript
// src/hooks/useWebcam.ts

// ... inside the useWebcam hook ...

      // Handle messages from worker
      workerRef.current.onmessage = (event: MessageEvent<{
        brightness: number; red: number; blue: number;
        brightness_delta: number; red_delta: number; blue_delta: number;
        brightness_power: number; red_power: number; blue_power: number;
      }>) => {
        // The core logic doesn't change, it just passes the larger object through.
        audioService.update(event.data);
      };

// ... rest of the hook
```

---

#### **Phase 13: Integrating New Signals into the UI and Audio Engine**

**Goal:** Make the new signals available for mapping in the UI and ensure the audio service can use them.

**Action 13.1: Expand the Signal Definitions in `useAppStore.ts`**
Add the new signal names to our `SignalName` type. The rest of the store logic, including the default mappings, can remain the same for now.

```typescript
// src/store/useAppStore.ts
// ... (imports) ...

export type SignalName =
  | 'brightness' | 'red' | 'blue'
  | 'brightness_delta' | 'red_delta' | 'blue_delta'
  | 'brightness_power' | 'red_power' | 'blue_power';

// ... (the rest of the file, including ParameterName, MappingValue, and the store itself, needs no changes) ...
```

**Action 13.2: Update the `MappingMatrix.tsx` to Display All Signals**
Modify the `signals` array to include all the new signal names. The component will dynamically expand to show the full matrix.

```typescript
// src/components/MappingMatrix.tsx
import React from 'react';
import { useAppStore, type ParameterName, type SignalName } from '../store/useAppStore';

// Expand this array to include all new signals
const signals: SignalName[] = [
  'brightness', 'red', 'blue',
  'brightness_delta', 'red_delta', 'blue_delta',
  'brightness_power', 'red_power', 'blue_power'
];

// ... (parameter and label definitions remain the same) ...

// ... (MappingCell component remains the same) ...

export function MappingMatrix() {
  return (
    <div className="mt-6 p-4 bg-gray-700 rounded-lg shadow-inner w-full max-w-lg">
      <h3 className="text-lg font-semibold mb-3 text-center">Mapping Matrix</h3>
      {/* Update grid columns to accommodate the new signals */}
      <div className="grid grid-cols-10 gap-2 text-center items-center">
        <div /> {/* Empty corner */}
        {signals.map(s => (
          <div key={s} className="text-xs font-bold text-gray-300 transform -rotate-45 whitespace-nowrap">
            {s.replace('_', ' ')}
          </div>
        ))}

        {parameters.map(p => (
          <React.Fragment key={p}>
            <div className="capitalize font-bold text-gray-300 text-right pr-2">
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
*Note: The `MappingMatrix` CSS has been adjusted here to better fit the larger number of columns.*

**Action 13.3: Confirm `audioService.ts` Requires No Changes**
This is a validation step. Because our `calculateTotalInfluence` helper function iterates over the keys in the mapping object, it will *automatically* incorporate the new signals as soon as they are mapped in the UI. No changes are needed in `audioService.ts`, which proves our architecture is scalable.

---

### Testing and Validation Plan

**Test Case 1: Testing Derivative (Delta) Signals**
1.  Start the application.
2.  In the `MappingMatrix`, set the `scale` to `0` for all mappings *except* for the cell connecting `Voice 1 Pitch` and `brightness_delta`. Set that `scale` to `1.0`.
3.  Hold your hand perfectly still in front of the camera. The pitch should be low and constant.
4.  Wave your hand quickly in front of the camera.
5.  **Expected Result:** The pitch of Voice 1 should spike upwards dramatically with movement and fall back to its base level when the scene is static. This proves the delta signal is working.

**Test Case 2: Testing Power Signals**
1.  Reset the mappings. Set the `scale` to `1.0` for `Voice 1 Pitch` -> `red`.
2.  Set the `scale` to `1.0` for `Voice 2 Pitch` -> `red_power`.
3.  Slowly introduce a red object into the camera's view.
4.  **Expected Result:** As the redness increases, both voices should rise in pitch. However, Voice 2's pitch should rise much more slowly at first, then increase exponentially faster than Voice 1's pitch as the scene becomes very red. This confirms the non-linear response of the power signal.