/**
 * Live UI panels — built with plain DOM + rAF.
 *
 * Demonstrates the two-tier architecture:
 *   - Meters read SignalBus.rawSources()/rawGenerics()/rawSinks() on rAF
 *     and mutate width/height attributes directly. ConfigStore is untouched
 *     by the animation loop.
 *   - Matrix scale sliders write to ConfigStore.update() on input; the
 *     scheduler recompiles the graph from the next subscribe-driven edit.
 *
 * Web Components + SVG widgets land in Stage 5; this is the minimum viable
 * "playable instrument" surface.
 */

import { GENERIC_LABELS } from "../preset/schema.ts";
import type { SignalBus } from "../signal/bus.ts";
import { compileGraph } from "../signal/graph.ts";
import type { Scheduler } from "../signal/scheduler.ts";
import type { ConfigStore } from "../store/config-store.ts";
import { MOMENT_KEYS, MOMENT_NAMES } from "../video/sources.ts";

// ─── Source-id → friendly name lookup ────────────────────────────────────────

const SOURCE_LABELS = new Map<string, string>();
for (let i = 0; i < MOMENT_KEYS.length; i++) {
  SOURCE_LABELS.set(MOMENT_KEYS[i] as string, MOMENT_NAMES[i] ?? (MOMENT_KEYS[i] as string));
}

function labelFor(sourceId: string): string {
  return SOURCE_LABELS.get(sourceId) ?? sourceId;
}

// ─── Meter primitives ────────────────────────────────────────────────────────

interface BipolarMeter {
  el: HTMLElement;
  posFill: HTMLElement;
  negFill: HTMLElement;
  valueEl: HTMLElement;
}

function makeRowMeter(label: string): BipolarMeter {
  const el = document.createElement("div");
  el.className = "meter";
  el.innerHTML = `
    <span class="label" title="${escapeHtml(label)}">${escapeHtml(label)}</span>
    <div class="bar">
      <div class="bar-zero"></div>
      <div class="bar-fill-neg"></div>
      <div class="bar-fill-pos"></div>
    </div>
    <span class="value">0.00</span>
  `;
  return {
    el,
    posFill: el.querySelector(".bar-fill-pos") as HTMLElement,
    negFill: el.querySelector(".bar-fill-neg") as HTMLElement,
    valueEl: el.querySelector(".value") as HTMLElement,
  };
}

function makeGenericMeter(label: string): BipolarMeter {
  const el = document.createElement("div");
  el.className = "generic-meter";
  el.innerHTML = `
    <span class="label">${escapeHtml(label)}</span>
    <div class="bar">
      <div class="bar-zero"></div>
      <div class="bar-fill-neg"></div>
      <div class="bar-fill-pos"></div>
    </div>
    <span class="value">0.00</span>
  `;
  return {
    el,
    posFill: el.querySelector(".bar-fill-pos") as HTMLElement,
    negFill: el.querySelector(".bar-fill-neg") as HTMLElement,
    valueEl: el.querySelector(".value") as HTMLElement,
  };
}

function updateMeterRow(m: BipolarMeter, value: number): void {
  const clamped = value < -1 ? -1 : value > 1 ? 1 : value;
  if (clamped >= 0) {
    m.posFill.style.width = `${clamped * 50}%`;
    m.negFill.style.width = "0%";
  } else {
    m.negFill.style.width = `${-clamped * 50}%`;
    m.posFill.style.width = "0%";
  }
  m.valueEl.textContent = clamped.toFixed(2);
}

function updateMeterGeneric(m: BipolarMeter, value: number): void {
  const clamped = value < -1 ? -1 : value > 1 ? 1 : value;
  if (clamped >= 0) {
    m.posFill.style.height = `${clamped * 50}%`;
    m.negFill.style.height = "0%";
  } else {
    m.negFill.style.height = `${-clamped * 50}%`;
    m.posFill.style.height = "0%";
  }
  m.valueEl.textContent = clamped.toFixed(2);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;",
  );
}

// ─── LiveUI ──────────────────────────────────────────────────────────────────

export interface LiveUIDeps {
  store: ConfigStore;
  bus: SignalBus;
  scheduler: Scheduler;
  genericContainer: HTMLElement;
  sourceContainer: HTMLElement;
  sinkContainer: HTMLElement;
  matrixContainer: HTMLElement;
}

export class LiveUI {
  readonly #deps: LiveUIDeps;
  readonly #genericMeters: BipolarMeter[] = [];
  readonly #sourceMeters = new Map<number, BipolarMeter>();
  readonly #sinkMeters = new Map<number, BipolarMeter>();
  #rafHandle = 0;
  readonly #unsubs: Array<() => void> = [];

  /**
   * Set when our own slider edits trigger a "matrix" subscription —
   * skip rebuild so we don't yank the slider out from under the user.
   */
  #suppressMatrixRebuild = false;

  constructor(deps: LiveUIDeps) {
    this.#deps = deps;
    this.#buildGenericMeters();
    this.#buildSinkMeters();
    this.#buildMatrixRows();
    this.#rebuildSourceMeters();
    this.#unsubs.push(
      deps.store.subscribe("matrix", () => {
        if (this.#suppressMatrixRebuild) return;
        this.#rebuildSourceMeters();
        this.#buildMatrixRows();
      }),
      deps.store.subscribe("sinks", () => this.#buildSinkMeters()),
    );
  }

  start(): void {
    const tick = () => {
      this.#paint();
      this.#rafHandle = requestAnimationFrame(tick);
    };
    this.#rafHandle = requestAnimationFrame(tick);
  }

  stop(): void {
    cancelAnimationFrame(this.#rafHandle);
    for (const u of this.#unsubs) u();
  }

  /**
   * Re-scan the bus for registered sources/sinks and rebuild meter rows.
   * Call after the audio engine starts (sinks just registered) or after
   * the camera starts (sources just registered).
   */
  refresh(): void {
    this.#rebuildSourceMeters();
    this.#buildSinkMeters();
  }

  // ─── Builders ──────────────────────────────────────────────────────────────

  #buildGenericMeters(): void {
    this.#deps.genericContainer.replaceChildren();
    this.#genericMeters.length = 0;
    for (const label of GENERIC_LABELS) {
      const m = makeGenericMeter(label);
      this.#deps.genericContainer.append(m.el);
      this.#genericMeters.push(m);
    }
  }

  /** Sources shown in the meter panel = the ones referenced by the matrix. */
  #rebuildSourceMeters(): void {
    const matrix = this.#deps.store.snapshot().matrix;
    const wanted = new Set<string>();
    for (const e of matrix) wanted.add(e.source);

    this.#deps.sourceContainer.replaceChildren();
    this.#sourceMeters.clear();
    for (const id of wanted) {
      const slot = this.#deps.bus.sourceSlot(id);
      if (slot === undefined) continue;
      const m = makeRowMeter(`${labelFor(id)}  (${id})`);
      this.#deps.sourceContainer.append(m.el);
      this.#sourceMeters.set(slot, m);
    }
  }

  #buildSinkMeters(): void {
    this.#deps.sinkContainer.replaceChildren();
    this.#sinkMeters.clear();
    for (const sink of this.#deps.store.snapshot().sinks) {
      const slot = this.#deps.bus.sinkSlot(sink.id);
      if (slot === undefined) continue;
      const m = makeRowMeter(`${sink.label}  (${sink.id})`);
      this.#deps.sinkContainer.append(m.el);
      this.#sinkMeters.set(slot, m);
    }
  }

  #buildMatrixRows(): void {
    const container = this.#deps.matrixContainer;
    container.replaceChildren();
    const matrix = this.#deps.store.snapshot().matrix;
    matrix.forEach((entry, idx) => {
      const row = document.createElement("div");
      row.className = "matrix-row";
      row.innerHTML = `
        <span class="source" title="${escapeHtml(entry.source)}">${escapeHtml(labelFor(entry.source))}</span>
        <span class="arrow">→ ${escapeHtml(GENERIC_LABELS[entry.generic] ?? String(entry.generic))}</span>
        <input type="range" min="-1" max="1" step="0.01" value="${entry.scale}" />
        <span class="scale-val">${entry.scale.toFixed(2)}</span>
      `;
      const range = row.querySelector("input") as HTMLInputElement;
      const valEl = row.querySelector(".scale-val") as HTMLElement;
      range.addEventListener("input", () => {
        const v = Number(range.value);
        valEl.textContent = v.toFixed(2);
        // Suppress rebuild — the user is dragging this exact slider
        this.#suppressMatrixRebuild = true;
        this.#deps.store.update((p) => {
          const m = p.matrix[idx];
          if (m !== undefined) m.scale = v;
        });
        this.#suppressMatrixRebuild = false;
        // Recompile on every edit. Cheap because the graph is flat.
        this.#deps.scheduler.setGraph(compileGraph(this.#deps.store.snapshot(), this.#deps.bus));
      });
      container.append(row);
    });
  }

  // ─── rAF paint ─────────────────────────────────────────────────────────────

  #paint(): void {
    const generics = this.#deps.bus.rawGenerics();
    for (let i = 0; i < this.#genericMeters.length; i++) {
      updateMeterGeneric(this.#genericMeters[i]!, generics[i] ?? 0);
    }
    const sources = this.#deps.bus.rawSources();
    for (const [slot, m] of this.#sourceMeters) {
      updateMeterRow(m, sources[slot] ?? 0);
    }
    const sinks = this.#deps.bus.rawSinks();
    for (const [slot, m] of this.#sinkMeters) {
      updateMeterRow(m, sinks[slot] ?? 0);
    }
  }
}
