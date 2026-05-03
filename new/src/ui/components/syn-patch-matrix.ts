/**
 * `<syn-patch-matrix>` — composes a grid of `<syn-scale-slider>` cells.
 *
 * Layout: HTML table.
 *   - Header row: α β γ δ ε ζ η θ (8 generic targets)
 *   - One row per source referenced in the matrix
 *   - Each (source, generic) cell is a `<syn-scale-slider>`. Zero-scale
 *     cells exist too — drag them up/down to add a routing.
 *
 * Reactive plumbing:
 *   - Subscribes to ConfigStore.matrix; rebuilds row/header structure when
 *     the *set* of sources or referenced generics changes. (Scale changes
 *     propagate via cell.setScale() without rebuild — keeps the user's
 *     in-flight drag intact.)
 *   - Runs ONE rAF loop. Per frame, for each visible cell:
 *       perturbation = scale × desaturate(source)
 *     Sets it on the cell so the shadow arrow animates.
 *   - On cell "change": locate-or-create the matrix entry for that
 *     (source, generic) and set its scale via store.update(). The
 *     #suppressRebuild flag guards against ripple from our own write.
 *
 * Doesn't own its data (sources, generics list); they're declared at
 * runtime by engines and the preset references them by id.
 */

import { GENERIC_COUNT, GENERIC_LABELS } from "../../preset/schema.ts";
import type { SignalBus } from "../../signal/bus.ts";
import { sevenBitSafe } from "../../signal/transform.ts";
import type { ConfigStore } from "../../store/config-store.ts";
import { MOMENT_KEYS, MOMENT_NAMES } from "../../video/sources.ts";
import { defineOnce, SynElement } from "./base.ts";
import "./syn-scale-slider.ts";
import type { SynScaleSlider } from "./syn-scale-slider.ts";

// Source id → friendly name. Falls back to id for unknowns (MIDI, etc.).
const SOURCE_LABELS = new Map<string, string>();
for (let i = 0; i < MOMENT_KEYS.length; i++) {
  SOURCE_LABELS.set(MOMENT_KEYS[i] as string, MOMENT_NAMES[i] ?? (MOMENT_KEYS[i] as string));
}
function labelFor(sourceId: string): string {
  return SOURCE_LABELS.get(sourceId) ?? sourceId;
}

interface CellRef {
  el: SynScaleSlider;
  source: string;
  generic: number;
  sourceSlot: number; // for rAF perturbation lookup; -1 if not yet registered
}

export class SynPatchMatrix extends SynElement {
  #store: ConfigStore | null = null;
  #bus: SignalBus | null = null;
  /** Triggered when the user moves a slider — a hook for the parent so it
   *  can recompile the signal graph after store mutates. */
  #onScaleChange: ((source: string, generic: number, scale: number) => void) | null = null;

  #cells: CellRef[] = [];
  #table!: HTMLTableElement;
  #suppressRebuild = false;

  constructor() {
    super();
    this.defineTemplate(`
      <style>
        :host { display: block; font-family: system-ui, sans-serif; color: #ddd; }
        table { border-collapse: collapse; }
        th, td { padding: 2px; vertical-align: middle; text-align: center; }
        th.source-label, td.source-label {
          text-align: left;
          padding-right: 0.75em;
          font-size: 0.85rem;
          white-space: nowrap;
          color: #ccc;
        }
        thead th { color: #aaa; font-weight: bold; }
        thead th.generic { font-size: 0.95rem; }
        tbody tr:nth-child(odd) { background: rgba(255, 255, 255, 0.025); }
      </style>
      <table>
        <thead><tr></tr></thead>
        <tbody></tbody>
      </table>
    `);
    this.#table = this.root.querySelector("table") as HTMLTableElement;
  }

  /**
   * Wire up data sources. Must be called before the element is connected
   * to the DOM (or you can call it any time and the matrix will rebuild).
   */
  configure(deps: {
    store: ConfigStore;
    bus: SignalBus;
    onScaleChange?: (source: string, generic: number, scale: number) => void;
  }): void {
    this.#store = deps.store;
    this.#bus = deps.bus;
    this.#onScaleChange = deps.onScaleChange ?? null;
    if (this.isConnected) this.#rebuild();
  }

  override connectedCallback(): void {
    if (this.#store) {
      const unsub = this.#store.subscribe("matrix", () => {
        if (this.#suppressRebuild) return;
        this.#rebuild();
      });
      this.onDisconnect(unsub);
      this.#rebuild();
    }
    this.startRaf(() => this.#paintPerturbations());
  }

  /** Re-resolve source slots after the camera engine registers them. */
  refreshSourceSlots(): void {
    if (!this.#bus) return;
    const bus = this.#bus;
    for (const c of this.#cells) {
      const slot = bus.sourceSlot(c.source);
      c.sourceSlot = slot ?? -1;
    }
  }

  // ─── Build ────────────────────────────────────────────────────────────────

  #rebuild(): void {
    if (!this.#store || !this.#bus) return;
    const matrix = this.#store.snapshot().matrix;

    // Sources to render = those referenced in the matrix, deduped, in
    // insertion order (stable enough; we can sort later if needed).
    const sources: string[] = [];
    const seen = new Set<string>();
    for (const e of matrix) {
      if (!seen.has(e.source)) {
        seen.add(e.source);
        sources.push(e.source);
      }
    }

    // Header
    const thead = this.#table.querySelector("thead tr") as HTMLTableRowElement;
    thead.replaceChildren();
    thead.append(document.createElement("th")); // empty corner over labels
    for (const label of GENERIC_LABELS) {
      const th = document.createElement("th");
      th.className = "generic";
      th.textContent = label;
      thead.append(th);
    }

    // Body
    const tbody = this.#table.querySelector("tbody") as HTMLTableSectionElement;
    tbody.replaceChildren();
    this.#cells = [];

    const bus = this.#bus;
    for (const source of sources) {
      const tr = document.createElement("tr");
      const labelCell = document.createElement("td");
      labelCell.className = "source-label";
      labelCell.title = source;
      labelCell.textContent = labelFor(source);
      tr.append(labelCell);

      for (let g = 0; g < GENERIC_COUNT; g++) {
        const td = document.createElement("td");
        const slider = document.createElement("syn-scale-slider") as SynScaleSlider;
        slider.setAttribute("width", "60");
        slider.setAttribute("height", "24");
        const entry = matrix.find((m) => m.source === source && m.generic === g);
        slider.setAttribute("scale", String(entry?.scale ?? 0));
        slider.addEventListener("change", (e) => {
          const value = (e as CustomEvent<{ value: number }>).detail.value;
          this.#writeScale(source, g, value);
        });
        td.append(slider);
        tr.append(td);
        this.#cells.push({
          el: slider,
          source,
          generic: g,
          sourceSlot: bus.sourceSlot(source) ?? -1,
        });
      }
      tbody.append(tr);
    }
  }

  // ─── Perturbation rAF ─────────────────────────────────────────────────────

  #paintPerturbations(): void {
    if (!this.#bus) return;
    const sources = this.#bus.rawSources();
    const s = sevenBitSafe;
    for (let i = 0; i < this.#cells.length; i++) {
      const c = this.#cells[i]!;
      if (c.sourceSlot < 0) {
        c.el.setPerturbation(0);
        continue;
      }
      const src = sources[c.sourceSlot]!;
      // desaturate(src) inlined; use the cell's own scale attribute as truth
      const scaleAttr = Number(c.el.getAttribute("scale") ?? 0);
      const desat = Math.atanh(src * s) / s;
      const desatClipped = desat < -3.13 ? -3.13 : desat > 3.13 ? 3.13 : desat;
      const contribution = scaleAttr * desatClipped;
      const clipped = contribution < -1 ? -1 : contribution > 1 ? 1 : contribution;
      c.el.setPerturbation(clipped);
    }
  }

  // ─── Store write ──────────────────────────────────────────────────────────

  #writeScale(source: string, generic: number, scale: number): void {
    if (!this.#store) return;
    this.#suppressRebuild = true;
    this.#store.update((p) => {
      const idx = p.matrix.findIndex((m) => m.source === source && m.generic === generic);
      if (idx >= 0) {
        const entry = p.matrix[idx];
        if (entry) entry.scale = scale;
      } else {
        p.matrix.push({
          source,
          generic: generic as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7,
          scale,
        });
      }
    });
    this.#suppressRebuild = false;
    this.#onScaleChange?.(source, generic, scale);
  }
}

defineOnce("syn-patch-matrix", SynPatchMatrix);
