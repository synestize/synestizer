import type { ReactNode } from 'react';
import { MappingMatrix } from '../MappingMatrix';

export function SettingsTab() {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Section title="MIDI Output">
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 10 }}>
          Connect a MIDI output device before pressing Start. The first available output
          is selected automatically. Full device selection arrives in Phase 3.
        </p>
        <MidiStatus />
      </Section>

      <Section title="Signal Routing">
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 10 }}>
          Each cell maps one camera signal to one sound parameter.{' '}
          <span style={{ color: '#4ade80' }}>Scale</span> sets amplification (positive = follows signal, negative = inverts).{' '}
          <span style={{ color: '#fbbf24' }}>Bias</span> transposes the output up or down regardless of the camera.
        </p>
        <MappingMatrix />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="glass-section">
      <div className="glass-section-header">{title}</div>
      <div style={{ padding: '10px 16px' }}>{children}</div>
    </div>
  );
}

function MidiStatus() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.8rem' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />
      <span style={{ color: 'rgba(255,255,255,0.35)' }}>
        Status shown here once audio is started.
      </span>
    </div>
  );
}
