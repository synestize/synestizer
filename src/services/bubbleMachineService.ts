import * as Tone from 'tone';
import { useAppStore, type SignalName, type ParameterName } from '../store/useAppStore';
import { calculateTotalInfluence, norm } from './influence';

function bubbleStep(voiceidx: number, pattern: number, density: number): boolean {
  const val = ((voiceidx + 23) * (11 + pattern) % 17) / 17 + 1 / 34;
  return val < density;
}

function noteForStep(
  step: number, rootNote: number, intervals: number[], pattern: number, bottomNote: number
): number {
  const pitchIdx = (step + 17) * pattern % intervals.length;
  const raw = rootNote + intervals[pitchIdx];
  return bottomNote + ((raw - bottomNote) % 12 + 12) % 12;
}

function drumHit(step: number, mult: number, offset: number, pattern: number, density: number): boolean {
  const val = ((step * mult + offset + pattern) % 17) / 17;
  return val < density;
}

class BubbleMachineService {
  private isStarted = false;

  // ── Melody ──
  private melody: Tone.FMSynth | null = null;
  private melodyFilter: Tone.Filter | null = null;
  private melodyVol: Tone.Volume | null = null;
  private melodyReverbSend: Tone.Gain | null = null;
  private melodyDelaySend: Tone.Gain | null = null;

  // ── Bass ──
  private bassNote: Tone.Synth | null = null;
  private bassFilter: Tone.Filter | null = null;
  private bassVol: Tone.Volume | null = null;
  private bassReverbSend: Tone.Gain | null = null;
  private bassDelaySend: Tone.Gain | null = null;

  // ── Drums ──
  private kick: Tone.MembraneSynth | null = null;
  private snare: Tone.NoiseSynth | null = null;
  private hat: Tone.NoiseSynth | null = null;
  private hatFilter: Tone.Filter | null = null;
  private drumsFilter: Tone.Filter | null = null;
  private drumsVol: Tone.Volume | null = null;
  private drumsReverbSend: Tone.Gain | null = null;
  private drumsDelaySend: Tone.Gain | null = null;

  // ── Shared FX return bus ──
  private sharedReverb: Tone.Reverb | null = null;
  private sharedDelay: Tone.FeedbackDelay | null = null;
  private fxReturn: Tone.Volume | null = null;

  // ── Loop ──
  private loop: Tone.Loop | null = null;

  // ── Sequencer state ──
  private rootNote = 48;
  private intervals = [0, 4, 7, 9];
  private melodyDensity = 0.35;
  private melodyPattern = 5;
  private drumDensity   = 0.55;
  private drumPattern   = 3;
  private drumPattern2  = 7;

  // ── Gains (dB) ──
  private melodyGainDb = -4;
  private bassGainDb   = -2;
  private drumsGainDb  =  0;

  private bpmThreshold = 1;

  // ── Manual FX floor (0–1) — camera adds on top via Signal Routing ──
  public fxBase = {
    melodyReverb: 0, melodyDelay: 0,
    bassReverb:   0, bassDelay:   0,
    drumsReverb:  0, drumsDelay:  0,
  };
  public setFxBase(key: keyof BubbleMachineService['fxBase'], val: number) { this.fxBase[key] = val; }
  public getFxBase() { return { ...this.fxBase }; }

  public activeStep = 0;
  public lastHit = { melody: false, bass: false, kick: false, snare: false, hat: false };
  public enabled = true;

  public async start() {
    if (this.isStarted) return;

    // ── Shared FX return bus (reverb + delay both connect here) ──
    this.fxReturn     = new Tone.Volume(-3).toDestination();
    this.sharedDelay  = new Tone.FeedbackDelay({ delayTime: 0.25, feedback: 0.3, wet: 1.0 }).connect(this.fxReturn);
    this.sharedReverb = new Tone.Reverb({ decay: 2.2, wet: 1.0 }).connect(this.fxReturn);
    await this.sharedReverb.ready;

    // ── Melody: FMSynth → filter → dry vol + reverb send + delay send ──
    this.melodyVol        = new Tone.Volume(this.melodyGainDb).toDestination();
    this.melodyReverbSend = new Tone.Gain(0).connect(this.sharedReverb);
    this.melodyDelaySend  = new Tone.Gain(0).connect(this.sharedDelay);
    this.melodyFilter     = new Tone.Filter(3500, 'lowpass');
    this.melodyFilter.connect(this.melodyVol);
    this.melodyFilter.connect(this.melodyReverbSend);
    this.melodyFilter.connect(this.melodyDelaySend);
    this.melody = new Tone.FMSynth({
      harmonicity: 2,
      modulationIndex: 5,
      oscillator:         { type: 'sine' },
      envelope:           { attack: 0.02, decay: 0.25, sustain: 0.15, release: 1.5 },
      modulation:         { type: 'sine' },
      modulationEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.8 },
    }).connect(this.melodyFilter);

    // ── Bass: sine → filter → dry vol + reverb send + delay send ──
    this.bassVol        = new Tone.Volume(this.bassGainDb).toDestination();
    this.bassReverbSend = new Tone.Gain(0).connect(this.sharedReverb);
    this.bassDelaySend  = new Tone.Gain(0).connect(this.sharedDelay);
    this.bassFilter     = new Tone.Filter(2000, 'lowpass');
    this.bassFilter.connect(this.bassVol);
    this.bassFilter.connect(this.bassReverbSend);
    this.bassFilter.connect(this.bassDelaySend);
    this.bassNote = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.02, decay: 0.2, sustain: 0.25, release: 0.6 },
    }).connect(this.bassFilter);

    // ── Drums: kick/snare/hat → drumsFilter → dry vol + reverb send + delay send ──
    this.drumsVol        = new Tone.Volume(this.drumsGainDb).toDestination();
    this.drumsReverbSend = new Tone.Gain(0).connect(this.sharedReverb);
    this.drumsDelaySend  = new Tone.Gain(0).connect(this.sharedDelay);
    this.drumsFilter     = new Tone.Filter(8000, 'lowpass');
    this.drumsFilter.connect(this.drumsVol);
    this.drumsFilter.connect(this.drumsReverbSend);
    this.drumsFilter.connect(this.drumsDelaySend);
    this.kick = new Tone.MembraneSynth({
      pitchDecay: 0.04, octaves: 8,
      envelope: { attack: 0.001, decay: 0.22, sustain: 0, release: 0.08 },
    }).connect(this.drumsFilter);
    this.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: { attack: 0.001, decay: 0.13, sustain: 0, release: 0.04 },
    }).connect(this.drumsFilter);
    this.hatFilter = new Tone.Filter(7000, 'highpass').connect(this.drumsFilter);
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

        if (bubbleStep(step, melodyPattern, melodyDensity)) {
          const midi = noteForStep(step, rootNote, intervals, melodyPattern, 60);
          this.melody?.triggerAttackRelease(Tone.Frequency(midi, 'midi').toFrequency(), '8n', time);
          this.lastHit.melody = true;
        }

        if (step % 2 === 0) {
          const bassStep    = Math.floor(step / 2);
          const bassDensity = melodyDensity * 0.65;
          const bassPattern = (melodyPattern + 4) % 16 + 1;
          if (bubbleStep(bassStep, bassPattern, bassDensity)) {
            const midi = noteForStep(bassStep, rootNote - 12, intervals, bassPattern, 36);
            this.bassNote?.triggerAttackRelease(Tone.Frequency(midi, 'midi').toFrequency(), '8n', time);
            this.lastHit.bass = true;
          }
        }

        if (drumHit(step, 4, 0, drumPattern, drumDensity * 0.52)) {
          this.kick?.triggerAttackRelease('C1', '8n', time);
          this.lastHit.kick = true;
        }

        if (drumHit(step, 4, 8, drumPattern2, drumDensity * 0.32)) {
          this.snare?.triggerAttackRelease('8n', time);
          this.lastHit.snare = true;
        }

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

    this.melody?.dispose();        this.melodyFilter?.dispose();   this.melodyVol?.dispose();
    this.melodyReverbSend?.dispose(); this.melodyDelaySend?.dispose();
    this.bassNote?.dispose();      this.bassFilter?.dispose();     this.bassVol?.dispose();
    this.bassReverbSend?.dispose(); this.bassDelaySend?.dispose();
    this.kick?.dispose();          this.snare?.dispose();          this.hat?.dispose();
    this.hatFilter?.dispose();     this.drumsFilter?.dispose();    this.drumsVol?.dispose();
    this.drumsReverbSend?.dispose(); this.drumsDelaySend?.dispose();
    this.sharedReverb?.dispose();  this.sharedDelay?.dispose();    this.fxReturn?.dispose();

    this.loop = null;
    this.melody = this.melodyFilter = this.melodyVol = null;
    this.melodyReverbSend = this.melodyDelaySend = null;
    this.bassNote = this.bassFilter = this.bassVol = null;
    this.bassReverbSend = this.bassDelaySend = null;
    this.kick = this.snare = this.hat = this.hatFilter = null;
    this.drumsFilter = this.drumsVol = null;
    this.drumsReverbSend = this.drumsDelaySend = null;
    this.sharedReverb = this.sharedDelay = this.fxReturn = null;
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
    this.melodyPattern = Math.max(1, Math.round(pRaw * 15));

    this.drumDensity  = norm(inf('bubble_v2_density'));
    this.drumPattern  = Math.round(norm(inf('bubble_v2_pattern')) * 16);
    this.drumPattern2 = Math.round(norm(inf('bubble_v2_pattern') * -0.7 + inf('bubble_density') * 0.3) * 16);

    this.rootNote = 48 + Math.round(norm(inf('bubble_root')) * 11);

    const ii  = 2  + Math.round(norm(inf('bubble_pitch_ii'))  * 4);
    const iii = 6  + Math.round(norm(inf('bubble_pitch_iii')) * 4);
    const iv  = 9  + Math.round(norm(inf('bubble_pitch_iv'))  * 4);
    this.intervals = [0, ii, iii, iv];

    // ── FM synthesis ──
    if (this.melody) {
      this.melody.modulationIndex.value = norm(inf('melody_fm_index')) * 30;
      this.melody.harmonicity.value     = 1 + norm(inf('melody_fm_harmonicity')) * 3;
    }

    // ── Per-channel filters (logarithmic Hz mapping) ──
    const logHz = (min: number, max: number, n: number) => min * Math.pow(max / min, n);
    this.melodyFilter?.frequency.rampTo(logHz(200,  8000, norm(inf('melody_filter_freq'))), 0.08);
    this.bassFilter?.frequency.rampTo(  logHz(80,   4000, norm(inf('bass_filter_freq'))), 0.08);
    this.drumsFilter?.frequency.rampTo( logHz(400, 16000, norm(inf('drums_filter_freq'))), 0.08);

    // ── FX sends — manual floor + camera on top, capped at 1 ──
    const c = (v: number) => Math.max(0, Math.min(1, v));
    const send = (base: number, cam: number) => Math.min(1, base + c(cam));
    const { fxBase: b } = this;
    this.melodyReverbSend?.gain.rampTo(send(b.melodyReverb, inf('melody_reverb')), 0.05);
    this.melodyDelaySend?.gain.rampTo( send(b.melodyDelay,  inf('melody_delay')),  0.05);
    this.bassReverbSend?.gain.rampTo(  send(b.bassReverb,   inf('bass_reverb')),   0.05);
    this.bassDelaySend?.gain.rampTo(   send(b.bassDelay,    inf('bass_delay')),    0.05);
    this.drumsReverbSend?.gain.rampTo( send(b.drumsReverb,  inf('drums_reverb')),  0.05);
    this.drumsDelaySend?.gain.rampTo(  send(b.drumsDelay,   inf('drums_delay')),   0.05);

    // ── BPM ──
    const bpmRaw = norm(inf('bubble_rate'));
    const newBpm = 75 + Math.round(bpmRaw * 75);
    if (Math.abs(newBpm - Math.round(Tone.getTransport().bpm.value)) >= this.bpmThreshold) {
      Tone.getTransport().bpm.rampTo(newBpm, 0.4);
    }
  }
}

export const bubbleMachineService = new BubbleMachineService();
