import { create } from 'zustand';
import { audioService } from '../services/audioService';

// Add new parameters for voice2
export type SignalName = 'brightness' | 'red' | 'blue';
export type ParameterName =
  | 'voice1_frequency'
  | 'voice1_filterCutoff'
  | 'voice2_frequency'
  | 'voice2_filterCutoff';

// This is the new shape for a single mapping cell
export interface MappingValue {
  scale: number;
  bias: number;
}

// The new state shape for all mappings
type Mappings = Record<ParameterName, Partial<Record<SignalName, MappingValue>>>;

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
      // Ensure the nested objects exist before updating
      if (!newMappings[parameter]) newMappings[parameter] = {};
      const currentMapping = newMappings[parameter][signal] || createDefaultMapping();

      newMappings[parameter][signal] = { ...currentMapping, ...value };

      return { mappings: newMappings };
    });
  },
}));