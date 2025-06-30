import * as Tone from 'tone';

class AudioService {
  private isStarted = false;
  private synth: Tone.Synth | null = null;

  public async start() {
    if (this.isStarted) return;
    await Tone.start();
    this.synth = new Tone.Synth().toDestination();
    this.synth.triggerAttack("C4");
    console.log("Audio service started with synth.");
    this.isStarted = true;
  }

  public stop() {
    if (!this.isStarted || !this.synth) return;
    this.synth.triggerRelease();
    this.synth = null;
    this.isStarted = false;
    console.log("Audio service stopped.");
  }

  // This method will be called directly with high-frequency data
  public update(brightness: number) {
    if (!this.isStarted || !this.synth) return;
    // Map brightness (0-1) to a musical frequency range (e.g., 200Hz to 800Hz)
    const frequency = brightness * 600 + 200;
    this.synth.setNote(frequency);
  }
}

export const audioService = new AudioService();