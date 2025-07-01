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