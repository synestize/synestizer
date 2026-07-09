import * as Tone from 'tone';
import { useAppStore, type SignalName, type ParameterName } from '../store/useAppStore';
import { calculateTotalInfluence, norm } from './influence';

// Prime-modulo formula: voiceidx 0–16 cycles non-repeatingly.
// Changing `pattern` scrambles which steps fire and in what order.
function bubbleStep(voiceidx: number, pattern: number, density: number): boolean {
  const val = ((voiceidx + 23) * (11 + pattern) % 17) / 17 + 1 / 34;
  return val < density;
}

// Pitch selection for a fired step
function noteForStep(
  step: number, rootNote: number, intervals: number[], pattern: number, bottomNote: number
): number {
  const pitchIdx = (step + 17) * pattern % intervals.length;
  const raw = rootNote + intervals[pitchIdx];
  return bottomNote + ((raw - bottomNote) % 12 + 12) % 12;
}

// Drum hit: different prime multipliers create different rhythmic cells
function drumHit(step: number, mult: number, offset: number, pattern: number, density: number): boolean {
  const val = ((step * mult + offset + pattern) % 17) / 17;
  return val < density;
}

class BubbleMachineService {
  private isStarted = false;

  // ── Melody (FM synthesis) ──
  private melody: Tone.FMSynth | null = null;
  private melodyFilter: Tone.Filter | null = null;
  private melodyVol: Tone.Volume | null = null;

  // ── Bass (sine, low) ──
  private bassNote: Tone.Synth | null = null;
  private bassVol: Tone.Volume | null = null;

  // ── Drums ──
  private kick: Tone.MembraneSynth | null = null;
  private snare: Tone.NoiseSynth | null = null;
  private hat: Tone.NoiseSynth | null = null;
  private hatFilter: Tone.Filter | null = null;
  private drumsVol: Tone.Volume | null = null;

  // ── Shared ──
  private reverb: Tone.Reverb | null = null;
  private loop: Tone.Loop | null = null;

  // ── Sequencer state ──
  private rootNote = 48;           // C3
  private intervals = [0, 4, 7, 9]; // major-6 chord
  private melodyDensity = 0.35;
  private melodyPattern = 5;
  private drumDensity   = 0.55;
  private drumPattern   = 3;
  private drumPattern2  = 7; // secondary pattern — snare/hat shifted differently

  // ── Gains (dB) ──
  private melodyGainDb = -4;
  private bassGainDb   = -2;
  private drumsGainDb  =  0;

  // Minimum BPM delta before a ramp fires (prevents AutomationTimeline bloat)
  private bpmThreshold = 1;

  // ── Public for visualiser ──
  public activeStep = 0;
  public lastHit = { melody: false, bass: false, kick: false, snare: false, hat: false };
  public enabled = true;

  public async start() {
    if (this.isStarted) return;

    // Reverb shared by melody
    this.melodyVol = new Tone.Volume(this.melodyGainDb).toDestination();
    this.reverb    = new Tone.Reverb({ decay: 1.8, wet: 0.28 }).connect(this.melodyVol);
    await this.reverb.ready;

    // Melody: FMSynth → lowpass filter → reverb → vol → dest
    // harmonicity 2 (modulator = octave above carrier), modulationIndex 5 (moderate FM depth)
    this.melodyFilter = new Tone.Filter(3500, 'lowpass').connect(this.reverb);
    this.melody = new Tone.FMSynth({
      harmonicity: 2,
      modulationIndex: 5,
      oscillator:          { type: 'sine' },
      envelope:            { attack: 0.02, decay: 0.25, sustain: 0.15, release: 1.5 },
      modulation:          { type: 'sine' },
      modulationEnvelope:  { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.8 },
    }).connect(this.melodyFilter);

    // Bass: sine → vol → dest (no reverb for tight low end)
    this.bassVol = new Tone.Volume(this.bassGainDb).toDestination();
    this.bassNote = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.02, decay: 0.2, sustain: 0.25, release: 0.6 },
    }).connect(this.bassVol);

    // Drums bus
    this.drumsVol = new Tone.Volume(this.drumsGainDb).toDestination();
    this.kick = new Tone.MembraneSynth({
      pitchDecay: 0.04, octaves: 8,
      envelope: { attack: 0.001, decay: 0.22, sustain: 0, release: 0.08 },
    }).connect(this.drumsVol);
    this.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.13, sustain: 0, release: 0.04 },
    }).connect(this.drumsVol);
    this.hatFilter = new Tone.Filter(7000, 'highpass').connect(this.drumsVol);
    this.hat = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.01 },
    }).connect(this.hatFilter);

    let step = 0;
    this.loop = new Tone.Loop((time) => {
      this.lastHit = { melody: false, bass: false, kick: false, snare: false, hat: false };
      this.activeStep = step;

      if (this.enabled) {
        const { intervals, rootNote, melodyDensity, melodyPattern, drumDensity, drumPattern, drumPattern2 } = this;

        // ── Melody ──
        if (bubbleStep(step, melodyPattern, melodyDensity)) {
          const midi = noteForStep(step, rootNote, intervals, melodyPattern, 60);
          this.melody?.triggerAttackRelease(
            Tone.Frequency(midi, 'midi').toFrequency(), '8n', time
          );
          this.lastHit.melody = true;
        }

        // ── Bass — half-speed (every other step) ──
        if (step % 2 === 0) {
          const bassStep = Math.floor(step / 2);
          const bassDensity = melodyDensity * 0.65;
          const bassPattern = (melodyPattern + 4) % 16 + 1;
          if (bubbleStep(bassStep, bassPattern, bassDensity)) {
            const midi = noteForStep(bassStep, rootNote - 12, intervals, bassPattern, 36);
            this.bassNote?.triggerAttackRelease(
              Tone.Frequency(midi, 'midi').toFrequency(), '8n', time
            );
            this.lastHit.bass = true;
          }
        }

        // ── Kick — uses drumPattern ──
        if (drumHit(step, 4, 0, drumPattern, drumDensity * 0.52)) {
          this.kick?.triggerAttackRelease('C1', '8n', time);
          this.lastHit.kick = true;
        }

        // ── Snare — uses drumPattern2 (decoupled from kick) ──
        if (drumHit(step, 4, 8, drumPattern2, drumDensity * 0.32)) {
          this.snare?.triggerAttackRelease('8n', time);
          this.lastHit.snare = true;
        }

        // ── HiHat — blends both patterns for maximum variety ──
        if (drumHit(step, 2, 1, (drumPattern + drumPattern2) % 17, drumDensity * 0.68)) {
          this.hat?.triggerAttackRelease('16n', time);
          this.lastHit.hat = true;
        }
      }

      step = (step + 1) % 17;
    }, '16n');

    this.loop.start(0);
    this.isStarted = true;
  }

  public stop() {
    if (!this.isStarted) return;
    this.loop?.stop();
    this.loop?.dispose();
    this.melody?.dispose();
    this.melodyFilter?.dispose();
    this.melodyVol?.dispose();
    this.reverb?.dispose();
    this.bassNote?.dispose();
    this.bassVol?.dispose();
    this.kick?.dispose();
    this.snare?.dispose();
    this.hat?.dispose();
    this.hatFilter?.dispose();
    this.drumsVol?.dispose();
    this.loop = this.melody = this.melodyFilter = this.melodyVol = this.reverb = null;
    this.bassNote = this.bassVol = null;
    this.kick = this.snare = this.hat = this.hatFilter = this.drumsVol = null;
    this.activeStep = 0;
    this.isStarted = false;
  }

  private applyVol(node: Tone.Volume | null, db: number) {
    if (!node) return;
    if (!isFinite(db)) { node.volume.value = -Infinity; } else { node.volume.rampTo(db, 0.05); }
  }

  public setMelodyGain(db: number)    { this.melodyGainDb = db; this.applyVol(this.melodyVol, db); }
  public setBassGain(db: number)      { this.bassGainDb   = db; this.applyVol(this.bassVol, db); }
  public setDrumsGain(db: number)     { this.drumsGainDb  = db; this.applyVol(this.drumsVol, db); }
  public setBPM(bpm: number)          { Tone.getTransport().bpm.rampTo(bpm, 0.2); }
  public setBpmThreshold(val: number) { this.bpmThreshold = val; }

  // Per-voice mute: silence/restore the individual synth before the mix chain
  public setMelodyMuted(m: boolean) { if (this.melody)   this.melody.volume.value   = m ? -Infinity : 0; }
  public setBassMuted(m: boolean)   { if (this.bassNote) this.bassNote.volume.value = m ? -Infinity : 0; }
  public setKickMuted(m: boolean)   { if (this.kick)     this.kick.volume.value     = m ? -Infinity : 0; }
  public setSnareMuted(m: boolean)  { if (this.snare)    this.snare.volume.value    = m ? -Infinity : 0; }
  public setHatMuted(m: boolean)    { if (this.hat)      this.hat.volume.value      = m ? -Infinity : 0; }

  public getMixGains() {
    return { melody: this.melodyGainDb, bass: this.bassGainDb, drums: this.drumsGainDb };
  }

  public update(signals: Record<SignalName, number>) {
    const mappings = useAppStore.getState().mappings;
    const inf = (p: ParameterName) => calculateTotalInfluence(p, signals, mappings);

    this.melodyDensity = norm(inf('bubble_density'));

    const pRaw = norm(inf('bubble_pattern'));
    this.melodyPattern = Math.max(1, Math.round(pRaw * 15)); // 1–16

    this.drumDensity  = norm(inf('bubble_v2_density'));
    this.drumPattern  = Math.round(norm(inf('bubble_v2_pattern')) * 16); // 0–16
    // Secondary pattern derived from chroma_red_variance — shifts snare/hat independently
    this.drumPattern2 = Math.round(norm(inf('bubble_v2_pattern') * -0.7 + inf('bubble_density') * 0.3) * 16);

    // Root note C3–B3 (48–59)
    this.rootNote = 48 + Math.round(norm(inf('bubble_root')) * 11);

    // Scale intervals (4 degrees)
    const ii  = 2  + Math.round(norm(inf('bubble_pitch_ii'))  * 4); // 2–6
    const iii = 6  + Math.round(norm(inf('bubble_pitch_iii')) * 4); // 6–10
    const iv  = 9  + Math.round(norm(inf('bubble_pitch_iv'))  * 4); // 9–13
    this.intervals = [0, ii, iii, iv];

    // FM synthesis — modulationIndex 0–30 (timbre brightness/complexity)
    if (this.melody) {
      this.melody.modulationIndex.value = norm(inf('melody_fm_index')) * 30;
      this.melody.harmonicity.value     = 1 + norm(inf('melody_fm_harmonicity')) * 3; // 1–4
    }

    // BPM: only fire a ramp when the signal moves more than bpmThreshold beats.
    const bpmRaw = norm(inf('bubble_rate'));
    const newBpm = 75 + Math.round(bpmRaw * 75);
    if (Math.abs(newBpm - Math.round(Tone.getTransport().bpm.value)) >= this.bpmThreshold) {
      Tone.getTransport().bpm.rampTo(newBpm, 0.4);
    }
  }
}

export const bubbleMachineService = new BubbleMachineService();
