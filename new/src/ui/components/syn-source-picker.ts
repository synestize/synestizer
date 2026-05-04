/**
 * `<syn-source-picker>` — adds new sources to the matrix.
 *
 * Lists every source registered with the SignalBus (filtered by a search
 * box). Picking a source + a target generic + clicking "Add" appends a
 * matrix entry with scale=0 — the user then drags that cell in the patch
 * matrix to give it a value.
 *
 * Closes the loop opened by Stage 4.5: previously you could only edit the
 * 4 routings baked into playablePreset(); now you can add any of the 60
 * video moments (and any future MIDI source) without editing JSON.
 */

import { GENERIC_COUNT, GENERIC_LABELS } from "../../preset/schema.ts";
import type { SignalBus } from "../../signal/bus.ts";
import type { ConfigStore } from "../../store/config-store.ts";
import { defineOnce, SynElement } from "./base.ts";

function labelFor(bus: SignalBus | null, id: string): string {
  return bus?.sourceLabel(id) ?? id;
}

export class SynSourcePicker extends SynElement {
  #store: ConfigStore | null = null;
  #bus: SignalBus | null = null;
  #onAdd: (() => void) | null = null;

  #searchInput!: HTMLInputElement;
  #sourceSelect!: HTMLSelectElement;
  #genericSelect!: HTMLSelectElement;
  #addBtn!: HTMLButtonElement;
  #randomizeBtn!: HTMLButtonElement;
  #clearBtn!: HTMLButtonElement;
  #status!: HTMLElement;

  constructor() {
    super();
    this.defineTemplate(`
      <style>
        :host { display: block; font-family: system-ui, sans-serif; color: #ddd; }
        .row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
        .row + .row { margin-top: 0.4rem; }
        .row .spacer { flex: 1; }
        .row .sources { flex: 1; min-width: 16em; }
        .row .search { flex: 1; }
        input, select, button { font: inherit; padding: 4px 6px; }
        input, select {
          background: #1a1a1a; color: #ccc; border: 1px solid #333;
        }
        button { cursor: pointer; background: var(--accent, #3af); color: #000; border: 0; border-radius: 3px; }
        .status { color: #888; font-size: 0.8rem; margin-top: 0.4rem; min-height: 1em; }
      </style>
      <div class="row">
        <label>Source</label>
        <select class="sources"></select>
        <label>→</label>
        <select class="generic"></select>
        <button class="add" type="button">Add to matrix</button>
      </div>
      <div class="row">
        <label>Filter</label>
        <input class="search" type="text" placeholder="filter sources by id or name…" />
      </div>
      <div class="row">
        <span class="spacer"></span>
        <button class="randomize" type="button" title="Perturb every existing matrix scale by ±0.5">🎲 Randomize scales</button>
        <button class="clear" type="button" title="Remove every entry from the matrix">⌫ Clear matrix</button>
      </div>
      <div class="status"></div>
    `);
    this.#sourceSelect = this.root.querySelector(".sources") as HTMLSelectElement;
    this.#genericSelect = this.root.querySelector(".generic") as HTMLSelectElement;
    this.#searchInput = this.root.querySelector(".search") as HTMLInputElement;
    this.#addBtn = this.root.querySelector(".add") as HTMLButtonElement;
    this.#randomizeBtn = this.root.querySelector(".randomize") as HTMLButtonElement;
    this.#clearBtn = this.root.querySelector(".clear") as HTMLButtonElement;
    this.#status = this.root.querySelector(".status") as HTMLElement;

    for (let g = 0; g < GENERIC_COUNT; g++) {
      const opt = document.createElement("option");
      opt.value = String(g);
      opt.textContent = `${GENERIC_LABELS[g]} (generic.${g})`;
      this.#genericSelect.append(opt);
    }

    this.#searchInput.addEventListener("input", () => this.#rebuildSourceOptions());
    this.#addBtn.addEventListener("click", () => this.#onAddClick());
    this.#randomizeBtn.addEventListener("click", () => this.#onRandomizeClick());
    this.#clearBtn.addEventListener("click", () => this.#onClearClick());
  }

  configure(deps: { store: ConfigStore; bus: SignalBus; onAdd?: () => void }): void {
    this.#store = deps.store;
    this.#bus = deps.bus;
    this.#onAdd = deps.onAdd ?? null;
    if (this.isConnected) this.#rebuildSourceOptions();
  }

  override connectedCallback(): void {
    this.#rebuildSourceOptions();
  }

  /** Call after engines register sources (camera, MIDI). */
  refresh(): void {
    this.#rebuildSourceOptions();
  }

  #rebuildSourceOptions(): void {
    if (!this.#bus) return;
    const filter = this.#searchInput.value.toLowerCase().trim();
    this.#sourceSelect.replaceChildren();
    let count = 0;
    for (let i = 0; i < this.#bus.sourceCount; i++) {
      const id = this.#bus.sourceId(i);
      if (!id) continue;
      const label = labelFor(this.#bus, id);
      if (filter && !id.toLowerCase().includes(filter) && !label.toLowerCase().includes(filter))
        continue;
      const opt = document.createElement("option");
      opt.value = id;
      opt.textContent = `${label}  —  ${id}`;
      this.#sourceSelect.append(opt);
      count++;
    }
    this.#status.textContent =
      count === 0
        ? this.#bus.sourceCount === 0
          ? "No sources registered yet — start the camera."
          : `0 sources match "${filter}".`
        : `${count} source${count === 1 ? "" : "s"} available.`;
    this.#addBtn.disabled = count === 0;
  }

  #onAddClick(): void {
    if (!this.#store) return;
    const source = this.#sourceSelect.value;
    const generic = Number(this.#genericSelect.value);
    if (!source || !Number.isInteger(generic) || generic < 0 || generic >= GENERIC_COUNT) return;

    this.#store.update((p) => {
      const exists = p.matrix.some((m) => m.source === source && m.generic === generic);
      if (!exists) {
        p.matrix.push({
          source,
          generic: generic as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
          scale: 0,
        });
      }
    });
    this.#status.textContent = `Added ${labelFor(this.#bus, source)} → ${GENERIC_LABELS[generic]}. Drag the cell in the matrix to set its scale.`;
    this.#onAdd?.();
  }

  #onRandomizeClick(): void {
    if (!this.#store) return;
    let n = 0;
    this.#store.update((p) => {
      n = p.matrix.length;
      for (const e of p.matrix) {
        // Random walk: existing scale + ±0.5 perturbation, clipped.
        const delta = (Math.random() - 0.5) * 1.0;
        const v = e.scale + delta;
        e.scale = v < -1 ? -1 : v > 1 ? 1 : v;
      }
    });
    this.#status.textContent =
      n === 0
        ? "Matrix is empty — add a routing first."
        : `Randomized ${n} scale${n === 1 ? "" : "s"}.`;
    this.#onAdd?.();
  }

  #onClearClick(): void {
    if (!this.#store) return;
    if (!confirm("Remove every entry from the matrix?")) return;
    this.#store.update((p) => {
      p.matrix = [];
    });
    this.#status.textContent = "Matrix cleared.";
    this.#onAdd?.();
  }
}

defineOnce("syn-source-picker", SynSourcePicker);
