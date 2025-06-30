import { create } from 'zustand';
import { audioService } from '../services/audioService';

interface AppState {
  isAudioRunning: boolean;
  startAudio: () => void;
  stopAudio: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  isAudioRunning: false,
  startAudio: () => {
    audioService.start();
    set({ isAudioRunning: true });
  },
  stopAudio: () => {
    audioService.stop();
    set({ isAudioRunning: false });
  },
}));