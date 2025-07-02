class MidiService {
  private isStarted = false;
  private midiAccess: MIDIAccess | null = null;
  private midiOutput: MIDIOutput | null = null;

  public async start() {
    if (this.isStarted) return;
    try {
      this.midiAccess = await navigator.requestMIDIAccess();
      // For now, let's just grab the first available output.
      const outputs = this.midiAccess.outputs.values();
      const firstOutput = outputs.next().value;

      if (firstOutput) {
        this.midiOutput = firstOutput;
        console.log(`MIDI service started, connected to: ${this.midiOutput.name}`);
        this.isStarted = true;
      } else {
        console.warn("No MIDI output devices found.");
      }
    } catch (error) {
      console.error("Failed to get MIDI access.", error);
    }
  }

  public stop() {
    if (!this.isStarted) return;
    // No specific stop action needed for MIDI output, just reset state.
    this.midiOutput = null;
    this.midiAccess = null;
    this.isStarted = false;
    console.log("MIDI service stopped.");
  }

  // This method now sends a real MIDI message.
  public sendCC(controller: number, value: number, channel = 1) {
    if (!this.isStarted || !this.midiOutput) return;
    // MIDI CC command is 0xB0, channel is added to it (0-15)
    const midiChannel = Math.max(0, Math.min(15, channel - 1));
    const command = 0xB0 + midiChannel;
    this.midiOutput.send([command, controller, value]);
  }
}

export const midiService = new MidiService();