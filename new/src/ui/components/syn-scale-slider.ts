/**
 * `<syn-scale-slider>` — matrix cell. SVG geometry ported from the original
 * src/components/ScaleSliderSVG.js.
 *
 * Visual layers:
 *   1. backing rect (full width × height)
 *   2. shadow arrow polygon — the LIVE perturbation indicator. Triangle from
 *      (midX, 0) → (midX + p·midX, midY) → (midX, height). Animated at rAF
 *      via setPerturbation().
 *   3. scale arrow polygon — STATIC (config-bound) signed scale. Triangle
 *      from (left, 0) → (right, midY) → (left, height) where left/right are
 *      midX ± scale·midX. Direction conveys sign.
 *   4. centre tick line at midX
 *   5. optional labels
 *
 * Drag: pointer events. The original RxJS gesture stream is replaced with
 * native Pointer Events (covers mouse + touch + pen in one API). Drag delta
 * is normalised to width — full traversal across the cell is ±1 in scale.
 *
 * Events fired:
 *   - "change" with detail={value} on every drag tick
 *   - "input"  same as change (matches HTML input convention)
 *
 * The cell is "controlled" — it does NOT write to ConfigStore. Parent
 * (`<syn-patch-matrix>`) handles store updates. Keeps the cell reusable.
 */

import { clip1 } from "../../signal/transform.ts";
import { defineOnce, SynElement } from "./base.ts";

const SCALE_FILL = "rgba(60, 130, 255, 0.85)";
const PERTURB_FILL = "rgba(0, 230, 255, 0.55)";
const BACKING_FILL = "rgba(0, 0, 0, 0.85)";
const TICK_COLOR = "rgba(255, 80, 80, 0.7)";

export class SynScaleSlider extends SynElement {
  static readonly observedAttributes = ["scale", "width", "height", "label"];

  #w = 80;
  #h = 28;
  #scale = 0;
  #perturbation = 0;

  #backing!: SVGRectElement;
  #scaleArrow!: SVGPolygonElement;
  #shadowArrow!: SVGPolygonElement;
  #tick!: SVGLineElement;
  #label!: SVGTextElement;
  #svg!: SVGSVGElement;

  constructor() {
    super();
    this.defineTemplate(`
      <style>
        :host { display: inline-block; line-height: 0; touch-action: none; user-select: none; cursor: ew-resize; }
        svg { display: block; }
      </style>
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect class="backing"/>
        <polygon class="shadow"/>
        <polygon class="scale"/>
        <line class="tick"/>
        <text class="label"/>
      </svg>
    `);
    this.#svg = this.root.querySelector("svg") as SVGSVGElement;
    this.#backing = this.root.querySelector(".backing") as SVGRectElement;
    this.#scaleArrow = this.root.querySelector(".scale") as SVGPolygonElement;
    this.#shadowArrow = this.root.querySelector(".shadow") as SVGPolygonElement;
    this.#tick = this.root.querySelector(".tick") as SVGLineElement;
    this.#label = this.root.querySelector(".label") as SVGTextElement;

    this.#scaleArrow.setAttribute("fill", SCALE_FILL);
    this.#shadowArrow.setAttribute("fill", PERTURB_FILL);
    this.#backing.setAttribute("fill", BACKING_FILL);
    this.#tick.setAttribute("stroke", TICK_COLOR);
    this.#tick.setAttribute("stroke-width", "1");
    this.#label.setAttribute("fill", "rgba(220, 220, 220, 0.8)");
    this.#label.setAttribute("font-size", "10");
    this.#label.setAttribute("font-family", "ui-monospace, monospace");

    this.addEventListener("pointerdown", this.#onPointerDown);
    this.addEventListener("dblclick", this.#onDoubleClick);
  }

  override connectedCallback(): void {
    this.#syncAttrs();
    this.#redrawStatic();
    this.#redrawPerturbation();
  }

  override attributeChangedCallback(name: string): void {
    if (!this.isConnected) return;
    this.#syncAttrs();
    if (name === "scale" || name === "width" || name === "height" || name === "label") {
      this.#redrawStatic();
      this.#redrawPerturbation();
    }
  }

  /** Set perturbation from rAF without going through attribute reflection. */
  setPerturbation(p: number): void {
    if (p === this.#perturbation) return;
    this.#perturbation = p;
    this.#redrawPerturbation();
  }

  /** Imperative scale setter (used by parent on store changes that bypass attrs). */
  setScale(s: number): void {
    if (s === this.#scale) return;
    this.#scale = s;
    this.#redrawStatic();
    this.#redrawPerturbation();
  }

  #syncAttrs(): void {
    this.#w = this.numAttr("width", 80);
    this.#h = this.numAttr("height", 28);
    this.#scale = clip1(this.numAttr("scale", this.#scale));
    this.#svg.setAttribute("width", String(this.#w));
    this.#svg.setAttribute("height", String(this.#h));
    this.#svg.setAttribute("viewBox", `0 0 ${this.#w} ${this.#h}`);
    this.#backing.setAttribute("x", "0");
    this.#backing.setAttribute("y", "0");
    this.#backing.setAttribute("width", String(this.#w));
    this.#backing.setAttribute("height", String(this.#h));
  }

  #redrawStatic(): void {
    const midX = this.#w / 2;
    const midY = this.#h / 2;
    const left = Math.round(midX - this.#scale * midX);
    const right = Math.round(midX + this.#scale * midX);
    this.#scaleArrow.setAttribute("points", `${left},0 ${right},${midY} ${left},${this.#h}`);
    this.#tick.setAttribute("x1", String(midX));
    this.#tick.setAttribute("x2", String(midX));
    this.#tick.setAttribute("y1", "0");
    this.#tick.setAttribute("y2", String(this.#h));
    const label = this.strAttr("label");
    if (label) {
      this.#label.textContent = label;
      this.#label.setAttribute("x", "2");
      this.#label.setAttribute("y", String(this.#h - 3));
    } else {
      this.#label.textContent = "";
    }
  }

  #redrawPerturbation(): void {
    const midX = this.#w / 2;
    const midY = this.#h / 2;
    const tip = Math.round(midX + this.#perturbation * midX);
    this.#shadowArrow.setAttribute("points", `${midX},0 ${tip},${midY} ${midX},${this.#h}`);
  }

  // ─── Pointer drag ─────────────────────────────────────────────────────────

  #onPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.preventDefault();
    this.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startVal = this.#scale;
    const move = (ev: PointerEvent) => {
      const delta = (2 * (ev.clientX - startX)) / this.#w;
      const v = clip1(startVal + delta);
      if (v !== this.#scale) {
        this.#scale = v;
        this.#redrawStatic();
        this.#redrawPerturbation();
        this.dispatchEvent(new CustomEvent("change", { detail: { value: v } }));
        this.dispatchEvent(new CustomEvent("input", { detail: { value: v } }));
      }
    };
    const up = (ev: PointerEvent) => {
      this.releasePointerCapture(ev.pointerId);
      this.removeEventListener("pointermove", move);
      this.removeEventListener("pointerup", up);
      this.removeEventListener("pointercancel", up);
    };
    this.addEventListener("pointermove", move);
    this.addEventListener("pointerup", up);
    this.addEventListener("pointercancel", up);
  };

  #onDoubleClick = (): void => {
    // Double-click resets scale to zero — matches the original UX.
    this.#scale = 0;
    this.#redrawStatic();
    this.#redrawPerturbation();
    this.dispatchEvent(new CustomEvent("change", { detail: { value: 0 } }));
    this.dispatchEvent(new CustomEvent("input", { detail: { value: 0 } }));
  };
}

defineOnce("syn-scale-slider", SynScaleSlider);
