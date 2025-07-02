import * as Tone from 'tone';
import { useAppStore, type SignalName } from '../store/useAppStore';

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