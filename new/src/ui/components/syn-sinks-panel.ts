/**
 * `<syn-sinks-panel>` — a row per audio-param sink. Each row shows:
 *
 *   [Label]   [signal selector dropdown]   [<syn-archimedean-slider>]   [eng value]
 *
 * The Archimedean slider exposes bias + scale; the dropdown picks which
 * combo-bus signal modulates the sink (combo bus = sources ∪ generics).
 *
 * Reactive plumbing is parallel to <syn-patch-matrix>:
 *   - Subscribes to ConfigStore.sinks; rebuilds rows when the *set* of
 *     sinks or available signals changes.
 *   - Single rAF loop. Per frame, for each row:
 *       perturbedValue = bus.readSink(sinkSlot)
 *       perturbation   = scale × desaturate(comboValue)
 *     and pushes both to the slider via setPerturbedValue/setPerturbation.
 *   - Slider emits bias-change/scale-change → store.update() with the
 *     #suppressRebuild flag to avoid a self-triggered rebuild mid-drag.
 *   - Dropdown change → update sinks[i].signal, force a rebuild (cheap).
 */

import { GENERIC_COUNT, GENERIC_LABELS, genericComboKey } from "../../preset/schema.ts";
import type { SignalBus } from "../../signal/bus.ts";
import { sevenBitSafe } from "../../signal/transform.ts";
import type { ConfigStore } from "../../store/config-store.ts";
import { defineOnce, SynElement } from "./base.ts";
import "./syn-archimedean-slider.ts";
import type { SynArchimedeanSlider } from "./syn-archimedean-slider.ts";

interface SinkRow {
  sinkId: string;
  sinkSlot: number; // -1 if not yet registered
  comboArray: Float32Array | null;
  comboSlot: number;
  scale: number; // mirrored from store; needed by rAF for desaturate × scale
  slider: SynArchimedeanSlider;
}

export class SynSinksPanel extends SynElement {
  #store: ConfigStore | null = null;
  #bus: SignalBus | null = null;
  #onChange: (() => void) | null = null;

  #rows: SinkRow[] = [];
  #table!: HTMLTableElement;
  #suppressRebuild = false;

  constructor() {
    super();
    this.defineTemplate(`
      <style>
        :host { display: block; font-family: system-ui, sans-serif; color: #ddd; }
        table { border-collapse: collapse; width: 100%; }
        th, td { padding: 4px 6px; vertical-align: middle; }
        thead th { color: #aaa; font-weight: bold; font-size: 0.85rem; text-align: left; border-bottom: 1px solid #333; }
        td.label { font-size: 0.9rem; color: #ccc; white-space: nowrap; }
        td.eng { font-family: ui-monospace, monospace; font-size: 0.8rem; color: #888; text-align: right; }
        select {
          background: #1a1a1a;
          color: #ccc;
          border: 1px solid #333;
          padding: 2px 4px;
          font: inherit;
          font-size: 0.85rem;
        }
      </style>
      <table>
        <thead>
          <tr>
            <th>Sink</th>
            <th>Signal</th>
            <th>Bias / Scale</th>
            <th style="text-align: right;">Value</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `);
    this.#table = this.root.querySelector("table") as HTMLTableElement;
  }

  configure(deps: { store: ConfigStore; bus: SignalBus; onChange?: () => void }): void {
    this.#store = deps.store;
    this.#bus = deps.bus;
    this.#onChange = deps.onChange ?? null;
    if (this.isConnected) this.#rebuild();
  }

  override connectedCallback(): void {
    if (this.#store) {
      const unsubSinks = this.#store.subscribe("sinks", () => {
        if (this.#suppressRebuild) return;
        this.#rebuild();
      });
      this.onDisconnect(unsubSinks);
      this.#rebuild();
    }
    this.startRaf(() => this.#paint());
  }

  /** Re-resolve sink slots and combo-bus pointers after engines register. */
  refresh(): void {
    if (!this.#bus) return;
    this.#rebuild();
  }

  // ─── Build ────────────────────────────────────────────────────────────────

  #rebuild(): void {
    if (!this.#store || !this.#bus) return;
    const snap = this.#store.snapshot();
    const tbody = this.#table.querySelector("tbody") as HTMLTableSectionElement;
    tbody.replaceChildren();
    this.#rows = [];

    for (let i = 0; i < snap.sinks.length; i++) {
      const sink = snap.sinks[i]!;
      const tr = document.createElement("tr");

      // Label
      const label = document.createElement("td");
      label.className = "label";
      label.textContent = sink.label || sink.id;
      label.title = sink.id;
      tr.append(label);

      // Signal selector
      const sigCell = document.createElement("td");
      const select = this.#buildSignalSelect(sink.signal);
      select.addEventListener("change", () => this.#writeSignal(i, select.value || null));
      sigCell.append(select);
      tr.append(sigCell);

      // Archimedean slider
      const sliderCell = document.createElement("td");
      const slider = document.createElement("syn-archimedean-slider") as SynArchimedeanSlider;
      slider.setAttribute("width", "240");
      slider.setAttribute("height", "64");
      slider.setAttribute("bias", String(sink.bias));
      slider.setAttribute("scale", String(sink.scale));
      slider.addEventListener("bias-change", (e) => {
        const v = (e as CustomEvent<{ value: number }>).detail.value;
        this.#writeBias(i, v);
      });
      slider.addEventListener("scale-change", (e) => {
        const v = (e as CustomEvent<{ value: number }>).detail.value;
        this.#writeScale(i, v);
      });
      sliderCell.append(slider);
      tr.append(sliderCell);

      // Engineering value (rAF-painted)
      const engCell = document.createElement("td");
      engCell.className = "eng";
      engCell.textContent = "—";
      tr.append(engCell);

      tbody.append(tr);

      // Resolve combo-bus pointer for this sink's signal
      const combo = sink.signal !== null ? this.#bus.resolveCombo(sink.signal) : null;

      this.#rows.push({
        sinkId: sink.id,
        sinkSlot: this.#bus.sinkSlot(sink.id) ?? -1,
        comboArray: combo?.array ?? null,
        comboSlot: combo?.slot ?? 0,
        scale: sink.scale,
        slider,
      });
    }
  }

  #buildSignalSelect(current: string | null): HTMLSelectElement {
    const sel = document.createElement("select");
    if (!this.#bus) return sel;

    // (none) option
    const none = document.createElement("option");
    none.value = "";
    none.textContent = "(unmodulated)";
    sel.append(none);

    // Generics α..θ
    for (let g = 0; g < GENERIC_COUNT; g++) {
      const opt = document.createElement("option");
      const key = genericComboKey(g as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7);
      opt.value = key;
      opt.textContent = `${GENERIC_LABELS[g]} (${key})`;
      sel.append(opt);
    }

    // Sources currently registered
    const sourceCount = this.#bus.sourceCount;
    if (sourceCount > 0) {
      const grp = document.createElement("optgroup");
      grp.label = "Sources";
      for (let i = 0; i < sourceCount; i++) {
        const id = this.#bus.sourceId(i);
        if (!id) continue;
        const opt = document.createElement("option");
        opt.value = id;
        opt.textContent = id;
        grp.append(opt);
      }
      sel.append(grp);
    }

    sel.value = current ?? "";
    return sel;
  }

  // ─── rAF paint ────────────────────────────────────────────────────────────

  #paint(): void {
    if (!this.#bus) return;
    const sinks = this.#bus.rawSinks();
    const tbody = this.#table.querySelector("tbody") as HTMLTableSectionElement;
    const trList = tbody.querySelectorAll("tr");
    const s = sevenBitSafe;

    for (let i = 0; i < this.#rows.length; i++) {
      const row = this.#rows[i]!;
      // Perturbed value (sink output, post-bias-scale-copula in [-1,1])
      const perturbedValue = row.sinkSlot >= 0 ? sinks[row.sinkSlot]! : 0;
      row.slider.setPerturbedValue(perturbedValue);

      // Per-sink perturbation (scale * desaturate(comboValue))
      let perturbation = 0;
      if (row.comboArray !== null) {
        const sig = row.comboArray[row.comboSlot]!;
        const ad = Math.atanh(sig * s) / s;
        const adC = ad < -3.13 ? -3.13 : ad > 3.13 ? 3.13 : ad;
        perturbation = row.scale * adC;
      }
      const pClipped = perturbation < -1 ? -1 : perturbation > 1 ? 1 : perturbation;
      row.slider.setPerturbation(pClipped);

      // Engineering value text
      const tr = trList[i];
      if (tr) {
        const engCell = tr.querySelector("td.eng");
        if (engCell) {
          const eng = row.sinkSlot >= 0 ? this.#bus.readSinkEng(row.sinkSlot) : 0;
          engCell.textContent = eng.toFixed(3);
        }
      }
    }
  }

  // ─── Store writes ─────────────────────────────────────────────────────────

  #writeBias(idx: number, value: number): void {
    if (!this.#store) return;
    this.#suppressRebuild = true;
    this.#store.update((p) => {
      const sink = p.sinks[idx];
      if (sink) sink.bias = value;
    });
    this.#suppressRebuild = false;
    this.#onChange?.();
  }

  #writeScale(idx: number, value: number): void {
    if (!this.#store) return;
    this.#suppressRebuild = true;
    this.#store.update((p) => {
      const sink = p.sinks[idx];
      if (sink) sink.scale = value;
    });
    this.#suppressRebuild = false;
    const row = this.#rows[idx];
    if (row) row.scale = value;
    this.#onChange?.();
  }

  #writeSignal(idx: number, signal: string | null): void {
    if (!this.#store || !this.#bus) return;
    this.#store.update((p) => {
      const sink = p.sinks[idx];
      if (sink) sink.signal = signal;
    });
    // Update the row's combo-bus pointer so rAF picks it up
    const row = this.#rows[idx];
    if (row) {
      const combo = signal !== null ? this.#bus.resolveCombo(signal) : null;
      row.comboArray = combo?.array ?? null;
      row.comboSlot = combo?.slot ?? 0;
    }
    this.#onChange?.();
  }
}

defineOnce("syn-sinks-panel", SynSinksPanel);
