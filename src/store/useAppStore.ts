import { create } from 'zustand';
import { audioService } from '../services/audioService';

// Define the types for our signals and parameters
export type SignalName = 'brightness' | 'red' | 'blue';
export type ParameterName = 'frequency' | 'filterCutoff';

interface AppState {
  isAudioRunning: boolean;
  mappings: Record<ParameterName, SignalName>;
  startAudio: () => void;
  stopAudio: () => void;
  setMapping: (parameter: ParameterName, signal: SignalName) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAudioRunning: false,
  // Default mapping on startup
  mappings: {
    frequency: 'brightness',
    filterCutoff: 'blue',
  },
  startAudio: () => {
    audioService.start();
    set({ isAudioRunning: true });
  },
  stopAudio: () => {
    audioService.stop();
    set({ isAudioRunning: false });
  },
  setMapping: (parameter, signal) => {
    set((state) => ({
      mappings: {
        ...state.mappings,
        [parameter]: signal,
      },
    }));
  },
}));