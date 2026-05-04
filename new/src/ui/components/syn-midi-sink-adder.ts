/**
 * `<syn-midi-sink-adder>` — adds outbound MIDI CC sinks to the preset.
 *
 * Pick output port + channel + CC, click "Add". A sink is appended to
 * preset.sinks with kind="midi.cc", id="midi.out.<port>.ch<N>.cc<M>",
 * and range=[0, 127] so runStage2 maps bipolar→7-bit. The MidiSinkDriver
 * picks it up via its sinks subscription and starts sending.
 *
 * The added sink shows up in <syn-sinks-panel> alongside audio sinks —
 * same Archimedean slider for bias/scale, same combo-bus signal selector.
 * Nothing else differs. The kind-specific behaviour is entirely in the
 * driver.
 */

import type { MidiEngine } from "../../midi/engine.ts";
import type { ConfigStore } from "../../store/config-store.ts";
import { defineOnce, SynElement } from "./base.ts";

export class SynMidiSinkAdder extends SynElement {
  #store: ConfigStore | null = null;
  #engine: MidiEngine | null = null;

  #portSelect!: HTMLSelectElement;
  #channelSelect!: HTMLSelectElement;
  #ccInput!: HTMLInputElement;
  #addBtn!: HTMLButtonElement;
  #status!: HTMLElement;

  constructor() {
    super();
    this.defineTemplate(`
      <style>
        :host { display: block; font-family: system-ui, sans-serif; color: #ddd; }
        .row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
        input, select, button { font: inherit; padding: 4px 6px; }
        input, select {
          background: #1a1a1a; color: #ccc; border: 1px solid #333;
        }
        button { cursor: pointer; background: var(--accent, #3af); color: #000; border: 0; border-radius: 3px; }
        button[disabled] { opacity: 0.4; cursor: not-allowed; }
        input[type=number] { width: 5em; }
        .status { color: #888; font-size: 0.8rem; margin-top: 0.4rem; min-height: 1em; }
      </style>
      <div class="row">
        <label>Port</label>
        <select class="port"></select>
        <label>CH</label>
        <select class="channel"></select>
        <label>CC</label>
        <input class="cc" type="number" min="0" max="127" value="74" />
        <button class="add" type="button">Add MIDI sink</button>
      </div>
      <div class="status"></div>
    `);
    this.#portSelect = this.root.querySelector(".port") as HTMLSelectElement;
    this.#channelSelect = this.root.querySelector(".channel") as HTMLSelectElement;
    this.#ccInput = this.root.querySelector(".cc") as HTMLInputElement;
    this.#addBtn = this.root.querySelector(".add") as HTMLButtonElement;
    this.#status = this.root.querySelector(".status") as HTMLElement;

    for (let ch = 1; ch <= 16; ch++) {
      const opt = document.createElement("option");
      opt.value = String(ch);
      opt.textContent = String(ch);
      this.#channelSelect.append(opt);
    }

    this.#addBtn.addEventListener("click", () => this.#onAddClick());
  }

  configure(deps: { store: ConfigStore; engine: MidiEngine }): void {
    this.#store = deps.store;
    this.#engine = deps.engine;
    if (this.isConnected) this.refresh();
  }

  override connectedCallback(): void {
    this.refresh();
  }

  /** Re-enumerate output ports — call when MIDI ports change. */
  refresh(): void {
    if (!this.#engine) {
      this.#status.textContent = "Enable MIDI first.";
      this.#addBtn.disabled = true;
      return;
    }
    const outputs = this.#engine.outputs();
    this.#portSelect.replaceChildren();
    if (outputs.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "(no MIDI outputs detected)";
      this.#portSelect.append(opt);
      this.#status.textContent = "Connect a MIDI output device.";
      this.#addBtn.disabled = true;
      return;
    }
    for (const port of outputs) {
      const opt = document.createElement("option");
      opt.value = port.id;
      opt.textContent = port.name ?? port.id;
      this.#portSelect.append(opt);
    }
    this.#status.textContent = `${outputs.length} MIDI output${outputs.length === 1 ? "" : "s"} available.`;
    this.#addBtn.disabled = false;
  }

  #onAddClick(): void {
    if (!this.#store || !this.#engine) return;
    const portId = this.#portSelect.value;
    const channel = Number(this.#channelSelect.value);
    const cc = Number(this.#ccInput.value);
    if (!portId || !Number.isInteger(channel) || channel < 1 || channel > 16) return;
    if (!Number.isInteger(cc) || cc < 0 || cc > 127) return;

    const port = this.#engine.outputs().find((p) => p.id === portId);
    const portName = port?.name ?? portId;
    const id = `midi.out.${portId}.ch${channel}.cc${cc}`;
    const label = `${portName} ch${channel} CC${cc}`;

    this.#store.update((p) => {
      const exists = p.sinks.some((s) => s.id === id);
      if (exists) return;
      p.sinks.push({
        id,
        kind: "midi.cc",
        label,
        signal: null,
        bias: 0,
        scale: 0.7,
        range: [0, 127],
      });
    });
    this.#status.textContent = `Added ${label}. Pick a signal in the sinks panel below.`;
  }
}

defineOnce("syn-midi-sink-adder", SynMidiSinkAdder);
