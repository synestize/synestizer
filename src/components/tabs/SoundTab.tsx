import { useCallback, useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';
import { audioService } from '../../services/audioService';
import { bubbleMachineService } from '../../services/bubbleMachineService';
import { useRecorder } from '../../hooks/useRecorder';

const C = {
  melody:  '#818cf8',
  bass:    '#34d399',
  kick:    '#f97316',
  snare:   '#f87171',
  hat:     '#94a3b8',
  sampler: '#facc15',
};

const SLIDER_MIN = -60;
const SLIDER_MAX = 6;
// Show "—" at bottom of slider (true silence), otherwise show dB value
const dbToLabel = (v: number) => v <= SLIDER_MIN ? '—' : `${v > 0 ? '+' : ''}${v} dB`;
const MAX_FILE_MB = 30;

type VoiceMutes = { melody: boolean; bass: boolean; kick: boolean; snare: boolean; hat: boolean; sampler: boolean };

type FxBaseKey = keyof ReturnType<typeof bubbleMachineService.getFxBase>;

export function SoundTab() {
  const mixInitial = bubbleMachineService.getMixGains();
  const [gains, setGains] = useState({
    melody:  mixInitial.melody,
    bass:    mixInitial.bass,
    drums:   mixInitial.drums,
    sampler: audioService.getSamplerGain(),
  });
  const [bpm, setBpm] = useState(95);
  const [bpmResponse, setBpmResponse] = useState(1);
  const [enabled, setEnabled] = useState(true);
  const [muted, setMuted] = useState<VoiceMutes>({
    melody: false, bass: false, kick: false, snare: false, hat: false, sampler: false,
  });
  const [fx, setFx] = useState(() => bubbleMachineService.getFxBase());

  const handleFx = (key: FxBaseKey, val: number) => {
    bubbleMachineService.setFxBase(key, val);
    setFx(prev => ({ ...prev, [key]: val }));
  };

  const handleGain = (voice: keyof typeof gains, sliderVal: number) => {
    setGains(g => ({ ...g, [voice]: sliderVal }));
    const db = sliderVal <= SLIDER_MIN ? -Infinity : sliderVal;
    switch (voice) {
      case 'melody':  bubbleMachineService.setMelodyGain(db); break;
      case 'bass':    bubbleMachineService.setBassGain(db);   break;
      case 'drums':   bubbleMachineService.setDrumsGain(db);  break;
      case 'sampler': audioService.setSamplerGain(db);        break;
    }
  };

  const toggleMute = (voice: keyof VoiceMutes) => {
    const next = !muted[voice];
    switch (voice) {
      case 'melody':  bubbleMachineService.setMelodyMuted(next); break;
      case 'bass':    bubbleMachineService.setBassMuted(next);   break;
      case 'kick':    bubbleMachineService.setKickMuted(next);   break;
      case 'snare':   bubbleMachineService.setSnareMuted(next);  break;
      case 'hat':     bubbleMachineService.setHatMuted(next);    break;
      case 'sampler': audioService.setSamplerMuted(next);        break;
    }
    setMuted(prev => ({ ...prev, [voice]: next }));
  };

  // Drums fader label: mutes/unmutes kick+snare+hat together
  const toggleDrumsMute = () => {
    const anyActive = !muted.kick || !muted.snare || !muted.hat;
    const next = anyActive;
    bubbleMachineService.setKickMuted(next);
    bubbleMachineService.setSnareMuted(next);
    bubbleMachineService.setHatMuted(next);
    setMuted(prev => ({ ...prev, kick: next, snare: next, hat: next }));
  };
  const drumsMuted = muted.kick && muted.snare && muted.hat;

  const handleBpm = (val: number) => {
    setBpm(val);
    Tone.getTransport().bpm.rampTo(val, 0.15);
  };

  const handleBpmResponse = (val: number) => {
    setBpmResponse(val);
    bubbleMachineService.setBpmThreshold(val);
  };

  const toggleEnabled = () => {
    const next = !enabled;
    setEnabled(next);
    bubbleMachineService.enabled = next;
  };

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>

      {/* ── Global controls ── */}
      <div className="glass-section">
        <div className="glass-section-header">Sequencer</div>
        <div style={{ padding: '10px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <button
              onClick={toggleEnabled}
              style={{
                padding: '4px 14px', fontSize: '0.72rem', fontWeight: 700,
                borderRadius: 4, cursor: 'pointer', letterSpacing: '0.06em',
                border: `1px solid ${enabled ? '#38bdf8' : 'rgba(255,255,255,0.2)'}`,
                background: enabled ? 'rgba(56,189,248,0.15)' : 'rgba(255,255,255,0.05)',
                color: enabled ? '#38bdf8' : 'rgba(255,255,255,0.4)',
              }}
            >
              {enabled ? '● ON' : '○ OFF'}
            </button>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.4, margin: 0 }}>
              17-step pattern sequencer — pattern and density shift with camera signals.
            </p>
          </div>

          {/* BPM slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>
              <span>Tempo</span>
              <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{bpm} BPM</span>
            </div>
            <input
              type="range" min="40" max="160" step="1" value={bpm}
              onChange={e => handleBpm(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8', touchAction: 'manipulation' }}
            />
          </div>

          {/* BPM camera response slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginBottom: 4 }}>
              <span>BPM Response</span>
              <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>
                {bpmResponse === 1 ? `±${bpmResponse} BPM — live` : bpmResponse >= 20 ? `±${bpmResponse} BPM — locked` : `±${bpmResponse} BPM`}
              </span>
            </div>
            <input
              type="range" min="1" max="30" step="1" value={bpmResponse}
              onChange={e => handleBpmResponse(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#38bdf8', touchAction: 'manipulation' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.58rem', color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>
              <span>reactive</span>
              <span>stable</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Step grid ── */}
      <StepGrid muted={muted} onMuteToggle={toggleMute} />

      {/* ── Voice volumes (vertical faders) ── */}
      <div className="glass-section">
        <div className="glass-section-header">Voice Mix — click label to mute</div>
        <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-around', gap: 6 }}>
          <VerticalFader label="Melody"  color={C.melody}  value={gains.melody}  onChange={db => handleGain('melody', db)}  muted={muted.melody}  onMuteToggle={() => toggleMute('melody')} />
          <VerticalFader label="Bass"    color={C.bass}    value={gains.bass}    onChange={db => handleGain('bass', db)}    muted={muted.bass}    onMuteToggle={() => toggleMute('bass')} />
          <VerticalFader label="Drums"   color={C.kick}    value={gains.drums}   onChange={db => handleGain('drums', db)}   muted={drumsMuted}    onMuteToggle={toggleDrumsMute} />
          <VerticalFader label="Sampler" color={C.sampler} value={gains.sampler} onChange={db => handleGain('sampler', db)} muted={muted.sampler} onMuteToggle={() => toggleMute('sampler')} />
        </div>
      </div>

      {/* ── FX sends ── */}
      <div className="glass-section">
        <div className="glass-section-header" style={{ color: '#e879f9' }}>FX Sends — Reverb &amp; Delay</div>
        <div style={{ padding: '10px 16px' }}>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginBottom: 10, lineHeight: 1.5 }}>
            Manual send floor — camera signals add on top via Signal Routing.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 1fr', gap: 4, alignItems: 'center' }}>
            <div />
            {(['Melody', 'Bass', 'Drums'] as const).map((lbl, i) => (
              <div key={lbl} style={{ textAlign: 'center', fontSize: '0.58rem', fontWeight: 700, color: [C.melody, C.bass, C.kick][i] }}>{lbl}</div>
            ))}
            <div style={{ fontSize: '0.58rem', color: '#e879f9', fontWeight: 700 }}>Rev</div>
            <FxSend value={fx.melodyReverb} color={C.melody} onChange={v => handleFx('melodyReverb', v)} />
            <FxSend value={fx.bassReverb}   color={C.bass}   onChange={v => handleFx('bassReverb', v)} />
            <FxSend value={fx.drumsReverb}  color={C.kick}   onChange={v => handleFx('drumsReverb', v)} />
            <div style={{ fontSize: '0.58rem', color: '#e879f9', fontWeight: 700, marginTop: 4 }}>Dly</div>
            <FxSend value={fx.melodyDelay}  color={C.melody} onChange={v => handleFx('melodyDelay', v)} />
            <FxSend value={fx.bassDelay}    color={C.bass}   onChange={v => handleFx('bassDelay', v)} />
            <FxSend value={fx.drumsDelay}   color={C.kick}   onChange={v => handleFx('drumsDelay', v)} />
          </div>
        </div>
      </div>

      {/* ── Sampler ── */}
      <SamplerRow />
    </div>
  );
}

// ── 5-row step grid visualiser ──
function StepGrid({ muted, onMuteToggle }: { muted: VoiceMutes; onMuteToggle: (v: keyof VoiceMutes) => void }) {
  const rowRefs = {
    melody: useRef<HTMLDivElement>(null),
    bass:   useRef<HTMLDivElement>(null),
    kick:   useRef<HTMLDivElement>(null),
    snare:  useRef<HTMLDivElement>(null),
    hat:    useRef<HTMLDivElement>(null),
  };
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const rows: { key: keyof typeof rowRefs; color: string; hitKey: keyof typeof bubbleMachineService.lastHit }[] = [
      { key: 'melody', color: C.melody,  hitKey: 'melody' },
      { key: 'bass',   color: C.bass,    hitKey: 'bass' },
      { key: 'kick',   color: C.kick,    hitKey: 'kick' },
      { key: 'snare',  color: C.snare,   hitKey: 'snare' },
      { key: 'hat',    color: C.hat,     hitKey: 'hat' },
    ];

    const tick = () => {
      const active = bubbleMachineService.activeStep;
      const hits   = bubbleMachineService.lastHit;

      rows.forEach(({ key, color, hitKey }) => {
        const el = rowRefs[key].current;
        if (!el) return;
        const cells = el.children;
        for (let i = 0; i < 17; i++) {
          const cell = cells[i] as HTMLDivElement;
          if (!cell) continue;
          const isActive = i === active;
          const fired    = isActive && hits[hitKey];
          cell.style.background = fired
            ? color
            : isActive
              ? 'rgba(255,255,255,0.22)'
              : 'rgba(255,255,255,0.05)';
          cell.style.boxShadow = fired ? `0 0 5px ${color}88` : 'none';
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rowLabels: { key: keyof typeof rowRefs; voiceKey: keyof VoiceMutes; label: string; color: string }[] = [
    { key: 'melody', voiceKey: 'melody', label: 'Melody', color: C.melody },
    { key: 'bass',   voiceKey: 'bass',   label: 'Bass',   color: C.bass },
    { key: 'kick',   voiceKey: 'kick',   label: 'Kick',   color: C.kick },
    { key: 'snare',  voiceKey: 'snare',  label: 'Snare',  color: C.snare },
    { key: 'hat',    voiceKey: 'hat',    label: 'Hat',    color: C.hat },
  ];

  return (
    <div className="glass-section">
      <div className="glass-section-header">Step Grid</div>
      <div style={{ padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {rowLabels.map(({ key, voiceKey, label, color }) => {
          const isMuted = muted[voiceKey];
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => onMuteToggle(voiceKey)}
                title={isMuted ? `Unmute ${label}` : `Mute ${label}`}
                style={{
                  background: 'none', border: 'none', padding: '0 2px', cursor: 'pointer',
                  fontSize: '0.58rem', fontWeight: 600, letterSpacing: '0.04em',
                  width: 36, textAlign: 'right', flexShrink: 0,
                  color: isMuted ? 'rgba(255,255,255,0.2)' : color,
                  textDecoration: isMuted ? 'line-through' : 'none',
                  transition: 'color 0.15s',
                }}
              >
                {label}
              </button>
              <div
                ref={rowRefs[key]}
                style={{ flex: 1, display: 'flex', gap: 2, opacity: isMuted ? 0.18 : 1, transition: 'opacity 0.15s' }}
              >
                {Array.from({ length: 17 }, (_, i) => (
                  <div key={i} style={{ flex: 1, height: 12, borderRadius: 2, background: 'rgba(255,255,255,0.05)', transition: 'background 0.05s' }} />
                ))}
              </div>
            </div>
          );
        })}
        <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>
          17 steps — click label to mute / unmute
        </div>
      </div>
    </div>
  );
}

// ── Sampler row ──
function SamplerRow() {
  const [sampleName, setSampleName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (url: string, name: string) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      await audioService.loadSample(url);
      setSampleName(name);
    } catch (err) {
      setLoadError('Failed to decode audio — try a different file or format.');
      console.error('Sample load:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleReady = useCallback((_blob: Blob, url: string) => {
    void loadFile(url, 'Recorded sample');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isRecording, secondsLeft, startRecording, stopRecording } = useRecorder(handleSampleReady);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    if (file.size / (1024 * 1024) > MAX_FILE_MB) {
      setLoadError(`File too large — max ${MAX_FILE_MB} MB.`);
      return;
    }
    void loadFile(URL.createObjectURL(file), file.name);
  };

  return (
    <div className="glass-section">
      <div className="glass-section-header" style={{ color: C.sampler }}>Sampler</div>
      <div style={{ padding: '10px 16px' }}>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: 10 }}>
          Looping player. Load any audio file (max {MAX_FILE_MB} MB) or record up to 15 s from your microphone.
          Rate and volume follow Signal Routing.
        </p>

        <div style={{ fontSize: '0.72rem', marginBottom: 10,
          color: loadError ? '#f87171' : sampleName ? C.sampler : 'rgba(255,255,255,0.2)',
          fontStyle: sampleName || loadError ? 'normal' : 'italic' }}>
          {isLoading ? '⟳ Decoding…' : loadError ?? sampleName ?? 'No sample loaded'}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} style={btnStyle('rgba(255,255,255,0.1)')}>
            {isLoading ? '⟳ Loading…' : '↑ Load file'}
          </button>
          <input ref={fileInputRef} type="file" accept="audio/*" style={{ display: 'none' }} onChange={handleFileChange} />

          {!isRecording
            ? <button onClick={startRecording} style={btnStyle('#7f1d1d', '#ef4444')}>● Record</button>
            : <button onClick={stopRecording}  style={btnStyle('#991b1b', '#f87171')}>■ Stop ({secondsLeft}s)</button>
          }

          {isRecording && (
            <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#ef4444', borderRadius: 2, width: `${((15 - secondsLeft) / 15) * 100}%`, transition: 'width 1s linear' }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Vertical channel fader ──
function VerticalFader({ label, color, value, onChange, muted, onMuteToggle }: {
  label: string; color: string; value: number; onChange: (db: number) => void;
  muted: boolean; onMuteToggle: () => void;
}) {
  const dim = muted ? 'rgba(255,255,255,0.2)' : color;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
      background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 6px', flex: 1,
    }}>
      <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: dim, minWidth: 36, textAlign: 'center', transition: 'color 0.15s' }}>
        {dbToLabel(value)}
      </span>
      <input
        type="range" min={SLIDER_MIN} max={SLIDER_MAX} step="1" value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        style={{
          writingMode: 'vertical-lr',
          direction: 'rtl',
          height: 120,
          width: 36,
          accentColor: muted ? 'rgba(255,255,255,0.2)' : color,
          cursor: 'ns-resize',
          touchAction: 'none',
          opacity: muted ? 0.4 : 1,
          transition: 'opacity 0.15s',
        }}
      />
      {/* Label acts as mute button */}
      <button
        onClick={onMuteToggle}
        title={muted ? `Unmute ${label}` : `Mute ${label}`}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
          fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
          color: dim,
          textDecoration: muted ? 'line-through' : 'none',
          transition: 'color 0.15s, text-decoration 0.15s',
        }}
      >
        {label}
      </button>
    </div>
  );
}

function FxSend({ value, color, onChange }: { value: number; color: string; onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <span style={{ fontSize: '0.52rem', fontFamily: 'monospace', color }}>{Math.round(value * 100)}%</span>
      <input
        type="range" min="0" max="1" step="0.01" value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: color, touchAction: 'manipulation' }}
      />
    </div>
  );
}

function btnStyle(bg: string, border?: string): React.CSSProperties {
  return {
    padding: '5px 12px', fontSize: '0.72rem', fontWeight: 600,
    borderRadius: 5, border: `1px solid ${border ?? 'rgba(255,255,255,0.15)'}`,
    background: bg, color: '#fff', cursor: 'pointer', letterSpacing: '0.03em',
  };
}
