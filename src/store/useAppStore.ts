import { create } from 'zustand';
import { audioService } from '../services/audioService';
import { midiService } from '../services/midiService';

export type SignalName =
  | 'brightness' | 'chroma_blue' | 'chroma_red'
  | 'brightness_variance' | 'chroma_blue_variance' | 'chroma_red_variance'
  | 'x_brightness' | 'y_brightness' | 'brightness_blue_corr'
  | 'brightness_delta' | 'chroma_blue_delta' | 'chroma_red_delta'
  | 'brightness_variance_delta' | 'chroma_blue_variance_delta' | 'chroma_red_variance_delta'
  | 'x_brightness_delta' | 'y_brightness_delta' | 'brightness_blue_corr_delta';

export type ParameterName =
  // Bubble Machine — melody & pitch
  | 'bubble_density' | 'bubble_pattern' | 'bubble_rate'
  | 'bubble_root' | 'bubble_pitch_ii' | 'bubble_pitch_iii' | 'bubble_pitch_iv'
  // Bubble Machine — drums
  | 'bubble_v2_density' | 'bubble_v2_pattern'
  // Sampler
  | 'sampler_rate' | 'sampler_volume'
  // MIDI CC
  | 'midi_cc_1' | 'midi_cc_2' | 'midi_cc_3' | 'midi_cc_4';

export interface MappingValue {
  scale: number;
  bias: number;
}

type Mappings = Partial<Record<ParameterName, Partial<Record<SignalName, MappingValue>>>>;

export type TabName = 'sound' | 'settings' | 'performance' | 'about';

interface AppState {
  isAudioRunning: boolean;
  mappings: Mappings;
  activeTab: TabName;
  isSignalDrawerOpen: boolean;
  startAudio: () => void;
  stopAudio: () => void;
  setMappingValue: (parameter: ParameterName, signal: SignalName, value: Partial<MappingValue>) => void;
  setActiveTab: (tab: TabName) => void;
  setSignalDrawerOpen: (open: boolean) => void;
}

const createDefaultMapping = (): MappingValue => ({ scale: 0, bias: 0 });

export const useAppStore = create<AppState>((set) => ({
  isAudioRunning: false,
  activeTab: 'sound',
  isSignalDrawerOpen: false,
  mappings: {
    // Melody density follows brightness (brighter image = more notes playing)
    bubble_density:    { brightness:        { scale: 0.7, bias: -0.2 } },
    // Pattern follows chroma_blue (blue hues shift the melodic pattern)
    bubble_pattern:    { chroma_blue:       { scale: 1.0, bias: 0.0 } },
    // Root note follows vertical centre of brightness
    bubble_root:       { y_brightness:      { scale: 0.6, bias: 0.0 } },
    // Drum density follows motion (camera movement = busier drums)
    bubble_v2_density: { brightness_delta:  { scale: 0.8, bias: 0.35 } },
    // Drum pattern follows chroma_red (red hues shift the beat)
    bubble_v2_pattern: { chroma_red:        { scale: 0.8, bias: 0.0 } },
    // BPM: movement speeds things up slightly; bias keeps default near 95 BPM
    bubble_rate:       { brightness_delta:  { scale: 0.3, bias: -0.35 } },
    // Sampler
    sampler_rate:      { x_brightness:      { scale: 0.5, bias: 0.0 } },
    sampler_volume:    { brightness:        { scale: 0.3, bias: 0.0 } },
    // MIDI
    midi_cc_1:         { y_brightness:      { scale: 1.0, bias: 0.0 } },
  },
  startAudio: () => {
    audioService.start();
    midiService.start();
    set({ isAudioRunning: true });
  },
  stopAudio: () => {
    audioService.stop();
    midiService.stop();
    set({ isAudioRunning: false });
  },
  setActiveTab:        (tab)  => set({ activeTab: tab }),
  setSignalDrawerOpen: (open) => set({ isSignalDrawerOpen: open }),
  setMappingValue: (parameter, signal, value) => {
    set((state) => {
      const newMappings = { ...state.mappings };
      if (!newMappings[parameter]) newMappings[parameter] = {};
      const current = newMappings[parameter]![signal] || createDefaultMapping();
      newMappings[parameter]![signal] = { ...current, ...value };
      return { mappings: newMappings };
    });
  },
}));
