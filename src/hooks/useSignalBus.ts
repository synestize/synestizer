import type { SignalName } from '../store/useAppStore';

export type ThumbKey =
  | 'brightness'
  | 'chroma_blue'
  | 'chroma_red'
  | 'x_brightness'
  | 'y_brightness'
  | 'brightness_blue_corr'
  | 'motion';

export type BusData = {
  signals: Record<SignalName, number>;
  thumbs: Record<ThumbKey, ImageData>;
};

export const signalBus: {
  latest: BusData | null;
  listeners: Set<(d: BusData) => void>;
} = { latest: null, listeners: new Set() };

export const THUMB_W = 80;
export const THUMB_H = 45;
