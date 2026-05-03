/**
 * `<syn-preset-widget>` — preset save/load.
 *
 * Three pieces:
 *   - Download current preset as JSON file
 *   - Upload a JSON file → ConfigStore.load() (validates via PresetSchema)
 *   - localStorage autosave: any ConfigStore change is debounced and
 *     written to localStorage["synestizer.preset"]; on construction we
 *     check for stored state and offer "Restore last session"
 *
 * URL preset loading + bundled presets come later (Stage 6 part 2).
 */

import type { Preset } from "../../preset/schema.ts";
import type { ConfigStore } from "../../store/config-store.ts";
import { defineOnce, SynElement } from "./base.ts";

const STORAGE_KEY = "synestizer.preset";
const AUTOSAVE_DEBOUNCE_MS = 500;

export class SynPresetWidget extends SynElement {
  #store: ConfigStore | null = null;

  #downloadBtn!: HTMLButtonElement;
  #uploadInput!: HTMLInputElement;
  #restoreBtn!: HTMLButtonElement;
  #status!: HTMLElement;
  #autosaveTimer = 0;

  constructor() {
    super();
    this.defineTemplate(`
      <style>
        :host { display: block; font-family: system-ui, sans-serif; color: #ddd; }
        .row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
        button, label.upload {
          font: inherit; padding: 4px 8px; cursor: pointer;
          background: var(--accent, #3af); color: #000; border: 0; border-radius: 3px;
        }
        button[disabled] { opacity: 0.4; cursor: not-allowed; }
        input[type="file"] { display: none; }
        .status { color: #888; font-size: 0.8rem; margin-top: 0.5rem; min-height: 1em; }
      </style>
      <div class="row">
        <button class="download" type="button">⬇ Download JSON</button>
        <label class="upload">
          ⬆ Upload JSON
          <input type="file" accept="application/json,.json" />
        </label>
        <button class="restore" type="button">↺ Restore last session</button>
      </div>
      <div class="status"></div>
    `);
    this.#downloadBtn = this.root.querySelector(".download") as HTMLButtonElement;
    this.#uploadInput = this.root.querySelector("input[type=file]") as HTMLInputElement;
    this.#restoreBtn = this.root.querySelector(".restore") as HTMLButtonElement;
    this.#status = this.root.querySelector(".status") as HTMLElement;

    this.#downloadBtn.addEventListener("click", () => this.#download());
    this.#uploadInput.addEventListener("change", () => this.#upload());
    this.#restoreBtn.addEventListener("click", () => this.#restore());
  }

  configure(deps: { store: ConfigStore }): void {
    this.#store = deps.store;
    if (this.isConnected) this.#bindAutosave();
    // Enable/disable Restore based on whether localStorage has anything
    this.#refreshRestoreBtn();
  }

  override connectedCallback(): void {
    if (this.#store) this.#bindAutosave();
    this.#refreshRestoreBtn();
  }

  #bindAutosave(): void {
    if (!this.#store) return;
    const unsub = this.#store.subscribe("**", () => {
      // Debounce — many edits in a drag shouldn't pound localStorage
      window.clearTimeout(this.#autosaveTimer);
      this.#autosaveTimer = window.setTimeout(() => this.#autosave(), AUTOSAVE_DEBOUNCE_MS);
    });
    this.onDisconnect(unsub);
    this.onDisconnect(() => window.clearTimeout(this.#autosaveTimer));
  }

  #autosave(): void {
    if (!this.#store) return;
    try {
      const json = JSON.stringify(this.#store.snapshot());
      localStorage.setItem(STORAGE_KEY, json);
      this.#refreshRestoreBtn();
    } catch (err) {
      // Quota exceeded, private mode, etc. Don't kill UX over autosave.
      console.warn("[preset-widget] autosave failed", err);
    }
  }

  #download(): void {
    if (!this.#store) return;
    const preset = this.#store.snapshot();
    const json = JSON.stringify(preset, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.download = `synestizer-preset-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.#setStatus(`Downloaded ${a.download}`);
  }

  #upload(): void {
    const file = this.#uploadInput.files?.[0];
    if (!file || !this.#store) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        const raw = JSON.parse(reader.result as string);
        this.#store?.load(raw);
        this.#setStatus(`Loaded ${file.name}.`);
      } catch (err) {
        this.#setStatus(`Failed to load ${file.name}: ${(err as Error).message}`);
      } finally {
        // Allow re-uploading the same file
        this.#uploadInput.value = "";
      }
    });
    reader.readAsText(file);
  }

  #restore(): void {
    if (!this.#store) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const raw = JSON.parse(stored);
      this.#store.load(raw as Preset);
      this.#setStatus("Restored from last session.");
    } catch (err) {
      this.#setStatus(`Restore failed: ${(err as Error).message}`);
    }
  }

  #refreshRestoreBtn(): void {
    const has = localStorage.getItem(STORAGE_KEY) !== null;
    this.#restoreBtn.disabled = !has;
  }

  #setStatus(text: string): void {
    this.#status.textContent = text;
  }
}

defineOnce("syn-preset-widget", SynPresetWidget);
