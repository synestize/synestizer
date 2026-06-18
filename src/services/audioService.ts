import * as Tone from 'tone';
import { useAppStore, type SignalName, type ParameterName } from '../store/useAppStore';
import { midiService } from './midiService';
import { calculateTotalInfluence, norm } from './influence';
import { bubbleMachineService } from './bubbleMachineService';

class AudioService {
  private isStarted = false;

  // ── Sampler: looping player ──
  private sampler: Tone.Player | null = null;
  private samplerVol: Tone.Volume | null = null;
  private currentSampleUrl: string | null = null;
  private samplerGainDb = -6;

  public async start() {
    if (this.isStarted) return;
    await Tone.start();

    Tone.getTransport().bpm.value = 95; // default BPM; bubbleMachineService.update() may override

    // Sampler
    this.samplerVol = new Tone.Volume(this.samplerGainDb).toDestination();
    this.sampler    = new Tone.Player({ loop: true, autostart: false }).connect(this.samplerVol);
    if (this.currentSampleUrl) {
      this.sampler.load(this.currentSampleUrl).then(() => this.sampler?.start());
    }

    await bubbleMachineService.start();
    Tone.getTransport().start();
    this.isStarted = true;
  }

  public stop() {
    if (!this.isStarted) return;
    bubbleMachineService.stop();
    Tone.getTransport().stop();

    this.sampler?.stop();
    this.sampler?.dispose();
    this.samplerVol?.dispose();
    this.sampler = this.samplerVol = null;
    this.isStarted = false;
  }

  // ── Sample loading ──
  public async loadSample(url: string) {
    if (this.currentSampleUrl?.startsWith('blob:')) URL.revokeObjectURL(this.currentSampleUrl);
    this.currentSampleUrl = url;
    if (!this.sampler) return;
    this.sampler.stop();
    await this.sampler.load(url);
    if (this.isStarted) this.sampler.start();
  }

  public clearSample() {
    if (this.currentSampleUrl?.startsWith('blob:')) URL.revokeObjectURL(this.currentSampleUrl);
    this.currentSampleUrl = null;
    this.sampler?.stop();
  }

  public setSamplerGain(db: number) {
    this.samplerGainDb = db;
    this.samplerVol?.volume.rampTo(db, 0.05);
  }

  public getSamplerGain() { return this.samplerGainDb; }

  public update(signals: Record<SignalName, number>) {
    if (!this.isStarted) return;
    const mappings = useAppStore.getState().mappings;
    const inf = (p: ParameterName) => calculateTotalInfluence(p, signals, mappings);

    // ── Sampler ──
    if (this.sampler?.loaded) {
      this.sampler.playbackRate = norm(inf('sampler_rate')) * 1.5 + 0.5; // 0.5–2.0×
      const sampVolDb = norm(inf('sampler_volume')) * 24 - 18 + this.samplerGainDb;
      this.samplerVol?.volume.rampTo(sampVolDb, 0.05);
    }

    // ── Bubble Machine ──
    bubbleMachineService.update(signals);

    // ── MIDI CC ──
    const toMidi = (v: number) => Math.round(norm(v) * 127);
    midiService.sendCC(1, toMidi(inf('midi_cc_1')));
    midiService.sendCC(2, toMidi(inf('midi_cc_2')));
    midiService.sendCC(3, toMidi(inf('midi_cc_3')));
    midiService.sendCC(4, toMidi(inf('midi_cc_4')));
  }
}

export const audioService = new AudioService();
