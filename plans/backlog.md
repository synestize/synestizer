
### Future Feature Backlog

You are absolutely right to start tracking the features that made the original so special. Here is a backlog of missing features we should plan to implement after this bug is fixed.

1.  **Integrated SVG Controls:**
    *   **Description:** Replace the current `scale` and `bias` sliders with a single, integrated SVG component per matrix cell, similar to the `ArchimedeanSlider` in `synestizer-blue`.
    *   **Value:** This provides much richer visual feedback, showing the static `bias`, the potential range of the `scale`, and the *actual, live* modulated value all in one control. This is key for understanding complex patches.

2.  **Advanced Signal Processing:**
    *   **Description:** The old app generated dozens of signals by calculating derivatives (`∆`), integrals (`∫`), power functions (`²`), and cross-products (`⌑`) of the base video signals.
    *   **Value:** This exponential increase in available source signals is the primary driver of creative possibility and happy accidents. We need to plan a new phase to implement this logic within our `featureExtractor.worker.ts`.

3.  **MIDI Integration:**
    *   **Description:** `synestizer-blue` could both listen to incoming MIDI CC messages (using them as signals) and send MIDI CC messages (using them as parameter destinations/sinks).
    *   **Value:** This turns the application from a standalone toy into a component that can be integrated with other music software (DAWs like Ableton Live, VCV Rack) and hardware synthesizers.

4.  **Preset System:**
    *   **Description:** The ability to save and load the application's entire state (specifically the mapping matrix) as a `.json` file.
    *   **Value:** Essential for saving creative patches and sharing them with others. We can leverage `zustand/middleware` to make this relatively straightforward.