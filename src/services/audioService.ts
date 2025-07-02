import * as Tone from 'tone';
import { useAppStore, type SignalName, type ParameterName } from '../store/useAppStore';
import { midiService } from './midiService'; // Import the MIDI service

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

    // --- NEW: Calculate and send MIDI Influences ---
    const midiCC1_influence = this.calculateTotalInfluence('midi_cc_1', signals, allMappings);
    const midiCC2_influence = this.calculateTotalInfluence('midi_cc_2', signals, allMappings);
    const midiCC3_influence = this.calculateTotalInfluence('midi_cc_3', signals, allMappings);
    const midiCC4_influence = this.calculateTotalInfluence('midi_cc_4', signals, allMappings);

    // Map influence (-1 to 1) to MIDI value (0 to 127)
    const midiValue1 = Math.round(((midiCC1_influence + 1) / 2) * 127);
    const midiValue2 = Math.round(((midiCC2_influence + 1) / 2) * 127);
    const midiValue3 = Math.round(((midiCC3_influence + 1) / 2) * 127);
    const midiValue4 = Math.round(((midiCC4_influence + 1) / 2) * 127);

    // Delegate sending to the midiService
    midiService.sendCC(1, midiValue1);
    midiService.sendCC(2, midiValue2);
    midiService.sendCC(3, midiValue3);
    midiService.sendCC(4, midiValue4);
  }
}

export const audioService = new AudioService();