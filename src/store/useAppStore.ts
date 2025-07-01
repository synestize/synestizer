import { create } from 'zustand';
import { audioService } from '../services/audioService';

export type SignalName = 'brightness' | 'red' | 'blue';
export type ParameterName = 'frequency' | 'filterCutoff';

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
  // Default mapping on startup. Brightness controls pitch, Blue controls filter.
  mappings: {
    frequency: {
      brightness: { scale: 1, bias: 0 },
    },
    filterCutoff: {
      blue: { scale: 1, bias: 0 },
    },
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