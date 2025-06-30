import * as Tone from 'tone';

class AudioService {
  private isStarted = false;

  public async start() {
    if (this.isStarted) return;
    // Tone.start() must be called after a user interaction
    await Tone.start();
    console.log("AudioContext started");
    this.isStarted = true;
    console.log("Audio service started");
  }

  public stop() {
    if (!this.isStarted) return;
    console.log("Audio service stopped");
    // In the future, this will stop the synthesizer
  }
}

export const audioService = new AudioService();