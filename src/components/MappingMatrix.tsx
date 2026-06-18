import React from 'react';
import { useAppStore, type ParameterName, type SignalName } from '../store/useAppStore';

const signals: SignalName[] = [
  'brightness', 'chroma_blue', 'chroma_red',
  'brightness_variance', 'chroma_blue_variance', 'chroma_red_variance',
  'x_brightness', 'y_brightness', 'brightness_blue_corr',
  'brightness_delta', 'chroma_blue_delta', 'chroma_red_delta',
  'brightness_variance_delta', 'chroma_blue_variance_delta', 'chroma_red_variance_delta',
  'x_brightness_delta', 'y_brightness_delta', 'brightness_blue_corr_delta',
];

const parameterLabels: Record<ParameterName, string> = {
  bubble_density:    'Melody Density',
  bubble_pattern:    'Melody Pattern',
  bubble_rate:       'Tempo (BPM)',
  bubble_root:       'Root Note',
  bubble_pitch_ii:   'Interval II',
  bubble_pitch_iii:  'Interval III',
  bubble_pitch_iv:   'Interval IV',
  bubble_v2_density: 'Drum Density',
  bubble_v2_pattern: 'Drum Pattern',
  sampler_rate:      'Sampler Rate',
  sampler_volume:    'Sampler Volume',
  midi_cc_1: 'MIDI CC 1',
  midi_cc_2: 'MIDI CC 2',
  midi_cc_3: 'MIDI CC 3',
  midi_cc_4: 'MIDI CC 4',
};

const groups: { label: string; color: string; params: ParameterName[] }[] = [
  { label: 'Melody',  color: '#818cf8', params: ['bubble_density', 'bubble_pattern', 'bubble_rate'] },
  { label: 'Pitch',   color: '#38bdf8', params: ['bubble_root', 'bubble_pitch_ii', 'bubble_pitch_iii', 'bubble_pitch_iv'] },
  { label: 'Drums',   color: '#f97316', params: ['bubble_v2_density', 'bubble_v2_pattern'] },
  { label: 'Sampler', color: '#facc15', params: ['sampler_rate', 'sampler_volume'] },
  { label: 'MIDI',    color: '#a78bfa', params: ['midi_cc_1', 'midi_cc_2', 'midi_cc_3', 'midi_cc_4'] },
];

// ── Mapping cell: scale bar (top) + bias marker (bottom) ──
function MappingCell({ parameter, signal, groupColor }: {
  parameter: ParameterName; signal: SignalName; groupColor: string;
}) {
  const { mappings, setMappingValue } = useAppStore();
  const mapping  = mappings[parameter]?.[signal] || { scale: 0, bias: 0 };
  const isActive = mapping.scale !== 0 || mapping.bias !== 0;

  const scalePct  = Math.abs(mapping.scale) / 2 * 100;
  const scaleLeft = mapping.scale >= 0 ? 50 : 50 - scalePct;
  const scaleColor = mapping.scale >= 0 ? '#4ade80' : '#f87171';
  const biasPos    = (mapping.bias + 2) / 4 * 100; // ±2 range → 0..100%

  return (
    <div style={{
      background: isActive ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.025)',
      padding: '5px 5px', borderRadius: 4,
      border: `1px solid ${isActive ? groupColor + '55' : 'transparent'}`,
    }}>
      {/* Scale */}
      <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.3)', marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
        <span>Scale</span>
        <span style={{ fontFamily: 'monospace', color: isActive ? scaleColor : 'rgba(255,255,255,0.25)' }}>
          {mapping.scale > 0 ? '+' : ''}{mapping.scale.toFixed(1)}
        </span>
      </div>
      <div style={{ position: 'relative', height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, marginBottom: 3, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${scaleLeft}%`, width: `${scalePct}%`, background: scaleColor, borderRadius: 3 }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(255,255,255,0.15)' }} />
      </div>
      <input
        type="range" min="-2" max="2" step="0.1" value={mapping.scale}
        onChange={e => setMappingValue(parameter, signal, { scale: parseFloat(e.target.value) })}
        style={{ width: '100%', height: 3, marginBottom: 4, touchAction: 'manipulation', accentColor: scaleColor }}
      />

      {/* Bias / Transpose */}
      <div style={{ fontSize: '0.52rem', color: 'rgba(255,255,255,0.3)', marginBottom: 2, display: 'flex', justifyContent: 'space-between' }}>
        <span>Bias</span>
        <span style={{ fontFamily: 'monospace', color: mapping.bias !== 0 ? '#fbbf24' : 'rgba(255,255,255,0.25)' }}>
          {mapping.bias > 0 ? '+' : ''}{mapping.bias.toFixed(2)}
        </span>
      </div>
      <div style={{ position: 'relative', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginBottom: 2 }}>
        <div style={{ position: 'absolute', top: -1, height: 6, width: 3, background: '#fbbf24', borderRadius: 1, left: `calc(${biasPos}% - 1.5px)` }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(255,255,255,0.15)' }} />
      </div>
      <input
        type="range" min="-2" max="2" step="0.05" value={mapping.bias}
        onChange={e => setMappingValue(parameter, signal, { bias: parseFloat(e.target.value) })}
        style={{ width: '100%', height: 3, touchAction: 'manipulation', accentColor: '#fbbf24' }}
      />
    </div>
  );
}

export function MappingMatrix() {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ marginBottom: 8, fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
        <span style={{ color: '#4ade80' }}>Scale</span> — how much the signal amplifies/inverts the parameter.{' '}
        <span style={{ color: '#fbbf24' }}>Bias</span> — shifts the output up or down independently of the camera.
      </div>
      <div
        style={{
          display: 'grid', gap: 2, textAlign: 'center', alignItems: 'center',
          gridTemplateColumns: `130px repeat(${signals.length}, minmax(70px, 1fr))`,
          minWidth: signals.length * 72 + 132,
        }}
      >
        {/* Header — signal names rotated */}
        <div />
        {signals.map(s => (
          <div key={s} style={{ height: 88, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <span style={{
              fontSize: '0.58rem', fontWeight: 600, color: 'rgba(255,255,255,0.4)',
              transform: 'rotate(-60deg) translateX(-4px)', whiteSpace: 'nowrap', transformOrigin: 'bottom left',
            }}>
              {s.replace(/_/g, ' ')}
            </span>
          </div>
        ))}

        {groups.map(group => (
          <React.Fragment key={group.label}>
            {group.params.map((p, i) => (
              <React.Fragment key={p}>
                <div style={{ textAlign: 'right', paddingRight: 8 }}>
                  {i === 0 && (
                    <div style={{ fontSize: '0.52rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: group.color, marginBottom: 2 }}>
                      {group.label}
                    </div>
                  )}
                  <div style={{ fontSize: '0.63rem', color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
                    {parameterLabels[p]}
                  </div>
                </div>
                {signals.map(s => (
                  <MappingCell key={`${p}-${s}`} parameter={p} signal={s} groupColor={group.color} />
                ))}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
