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