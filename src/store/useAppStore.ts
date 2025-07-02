import { create } from 'zustand';
import { audioService } from '../services/audioService';
import { midiService } from '../services/midiService'; // Import the new service

// This is our new, much richer, set of signals
export type SignalName =
  | 'brightness' | 'chroma_blue' | 'chroma_red'
  | 'brightness_variance' | 'chroma_blue_variance' | 'chroma_red_variance'
  | 'x_brightness' | 'y_brightness' | 'brightness_blue_corr'
  | 'brightness_delta' | 'chroma_blue_delta' | 'chroma_red_delta'
  | 'brightness_variance_delta' | 'chroma_blue_variance_delta' | 'chroma_red_variance_delta'
  | 'x_brightness_delta' | 'y_brightness_delta' | 'brightness_blue_corr_delta';
// Add new MIDI parameters
export type ParameterName =
  | 'voice1_frequency' | 'voice1_filterCutoff'
  | 'voice2_frequency' | 'voice2_filterCutoff'
  | 'midi_cc_1' | 'midi_cc_2' | 'midi_cc_3' | 'midi_cc_4';

// This is the new shape for a single mapping cell
export interface MappingValue {
  scale: number;
  bias: number;
}

// The new state shape for all mappings
type Mappings = Partial<Record<ParameterName, Partial<Record<SignalName, MappingValue>>>>;

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
  // Updated default mappings to showcase new signal capabilities
  mappings: {
    // Keep existing defaults
    voice1_frequency: { brightness: { scale: 1, bias: 0 } },
    voice1_filterCutoff: { brightness_variance: { scale: 1, bias: 0 } },
    voice2_frequency: { x_brightness: { scale: 1, bias: 0 } }, // Pan L-R to change pitch
    voice2_filterCutoff: { brightness_delta: { scale: 1, bias: 0 } }, // Movement opens filter
    // Add a default MIDI mapping to demonstrate the feature
    midi_cc_1: { y_brightness: { scale: 1, bias: 0 } },
  },
  startAudio: () => {
    audioService.start();
    midiService.start(); // Start the MIDI service
    set({ isAudioRunning: true });
  },
  stopAudio: () => {
    audioService.stop();
    midiService.stop(); // Stop the MIDI service
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