import { useEffect, useRef } from 'react';
import { signalBus, THUMB_W, THUMB_H, type ThumbKey, type BusData } from '../hooks/useSignalBus';
import type { SignalName } from '../store/useAppStore';

type ThumbCard = {
  key: ThumbKey;
  label: string;
  description: string;
  signals: SignalName[];
  color: string;
};

const THUMB_CARDS: ThumbCard[] = [
  { key: 'brightness',           label: 'Luminance',   description: 'Y channel',    signals: ['brightness', 'brightness_variance'],           color: 'text-yellow-300'  },
  { key: 'chroma_blue',          label: 'Chroma Blue', description: 'Cb channel',   signals: ['chroma_blue', 'chroma_blue_variance'],          color: 'text-blue-300'    },
  { key: 'chroma_red',           label: 'Chroma Red',  description: 'Cr channel',   signals: ['chroma_red', 'chroma_red_variance'],            color: 'text-red-300'     },
  { key: 'x_brightness',         label: 'H. Profile',  description: 'Left↔Right',   signals: ['x_brightness'],                                color: 'text-orange-300'  },
  { key: 'y_brightness',         label: 'V. Profile',  description: 'Top↕Bottom',   signals: ['y_brightness'],                                color: 'text-teal-300'    },
  { key: 'brightness_blue_corr', label: 'Luma↔Blue',   description: 'Correlation',  signals: ['brightness_blue_corr'],                        color: 'text-purple-300'  },
  { key: 'motion',               label: 'Motion',      description: 'Frame delta',  signals: ['brightness_delta'],                            color: 'text-pink-300'    },
];

interface Props {
  compact?: boolean;
}

export function SignalPanel({ compact = false }: Props) {
  const canvasRefs = useRef<Partial<Record<ThumbKey, HTMLCanvasElement>>>({});
  const valueRefs  = useRef<Partial<Record<string, HTMLSpanElement>>>({});

  useEffect(() => {
    const handleData = (d: BusData) => {
      for (const card of THUMB_CARDS) {
        const canvas = canvasRefs.current[card.key];
        if (!canvas) continue;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        ctx.putImageData(d.thumbs[card.key], 0, 0);
      }
      const sigs = d.signals as Record<string, number>;
      for (const [sigName, span] of Object.entries(valueRefs.current)) {
        if (span && sigName in sigs) {
          span.textContent = sigs[sigName].toFixed(3);
        }
      }
    };
    signalBus.listeners.add(handleData);
    return () => { signalBus.listeners.delete(handleData); };
  }, []);

  if (compact) {
    // Single vertical column — thumbnails stacked top to bottom
    return (
      <div className="px-3 pb-4">
        <div className="flex flex-col gap-2">
          {THUMB_CARDS.map(card => (
            <div key={card.key} className="rounded overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <canvas
                ref={el => { canvasRefs.current[card.key] = el ?? undefined; }}
                width={THUMB_W}
                height={THUMB_H}
                className="w-full block"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="px-2 py-1.5">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className={`text-xs font-semibold tracking-wide ${card.color}`}>{card.label}</span>
                  <span className="text-xs text-gray-600 italic">{card.description}</span>
                </div>
                {card.signals.map(sig => (
                  <div key={sig} className="flex justify-between items-baseline">
                    <span className="text-gray-500 text-xs truncate pr-2">
                      {sig.replace(/_delta$/, 'Δ').replace(/_variance$/, 'σ').replace(/_/g, ' ')}
                    </span>
                    <span
                      ref={el => { valueRefs.current[sig] = el ?? undefined; }}
                      className="font-mono text-xs text-gray-300 tabular-nums flex-shrink-0"
                    >
                      —
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full layout (unused now — drawer is the only entry point — kept for flexibility)
  return (
    <div className="w-full max-w-4xl px-4 mt-3">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Signal Channels
        </h3>
        <div className="flex-1 h-px bg-gray-700" />
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {THUMB_CARDS.map(card => (
          <div key={card.key} className="bg-gray-900 rounded-lg overflow-hidden">
            <canvas
              ref={el => { canvasRefs.current[card.key] = el ?? undefined; }}
              width={THUMB_W}
              height={THUMB_H}
              className="w-full block"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="px-1.5 py-1">
              <div className={`text-xs font-semibold leading-tight ${card.color}`}>
                {card.label}
              </div>
              <div className="text-xs text-gray-500 leading-tight mb-1">
                {card.description}
              </div>
              {card.signals.map(sig => (
                <div key={sig} className="flex justify-between items-baseline">
                  <span className="text-gray-600 text-xs truncate pr-1">
                    {sig.replace(/_delta$/, 'Δ').replace(/_variance$/, 'σ').replace(/_/g, ' ')}
                  </span>
                  <span
                    ref={el => { valueRefs.current[sig] = el ?? undefined; }}
                    className="font-mono text-xs text-gray-300 flex-shrink-0"
                  >
                    —
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
