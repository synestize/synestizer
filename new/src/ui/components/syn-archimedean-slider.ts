/**
 * `<syn-archimedean-slider>` — sink widget. SVG geometry ported from
 * src/components/ArchimedeanSliderSVG.js.
 *
 * Two interlinked controls in one widget:
 *
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │   ╱┐                                                        │   <- scale-slider area (top half)
 *   │  ╱ │     scale arrow + perturbation envelope                │
 *   │ ╱  │                                                        │
 *   ├─━━━╋━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┤
 *   │            ────●────                                        │   <- bias track (bottom half)
 *   │                ▲                                            │
 *   │              perturb arrow shows actually-applied value     │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * The scale-slider on top is shifted horizontally so its centre sits over
 * the current bias position — that's the "Archimedean" linkage. The
 * envelope polygon connects the scale-slider tip to the two extreme
 * perturbation points along the bias track, making bias↔scale↔value
 * visually integrated. See ArchimedeanSliderSVG.js:152-155 for the
 * canonical envelope geometry — that polygon is the spirit of the widget.
 *
 * Drag affordances:
 *   - Pointerdown on the bias track (bottom half) → drag bias.
 *   - Pointerdown on the scale-slider (top half) → drag scale.
 *
 * Events:
 *   - "bias-change"  detail={value}
 *   - "scale-change" detail={value}
 *   Both also dispatch a generic "change" event with detail={kind, value}.
 *
 * Live state from rAF (parent calls):
 *   - setPerturbedValue(v)  — final actual sink value (post bias+scale+sig)
 *   - setPerturbation(v)    — the per-cell perturbation magnitude (signed)
 */

import { copula } from "../../signal/copula.ts";
import { clip1 } from "../../signal/transform.ts";
import { defineOnce, SynElement } from "./base.ts";

const SCALE_FILL = "rgba(60, 130, 255, 0.85)";
const PERTURB_FILL = "rgba(0, 230, 255, 0.6)";
const TRACK_FILL = "rgba(120, 120, 120, 0.6)";
const BIAS_BG_FILL = "rgba(0, 0, 0, 0.4)";
const TICK_COLOR = "rgba(255, 80, 80, 0.7)";
const ENVELOPE_STROKE = "rgba(60, 130, 255, 0.85)";
const LABEL_FILL = "rgba(220, 220, 220, 0.9)";

export class SynArchimedeanSlider extends SynElement {
  static readonly observedAttributes = ["bias", "scale", "width", "height", "label"];

  #w = 256;
  #h = 80;
  #bias = 0;
  #scale = 0;
  #perturbedValue = 0;
  #perturbation = 0;

  // Element refs (assigned in constructor)
  #svg!: SVGSVGElement;
  #biasBg!: SVGRectElement;
  #track!: SVGRectElement;
  #zeroTick!: SVGLineElement;
  #perturbArrow!: SVGPolygonElement;
  #scaleBacking!: SVGRectElement;
  #scaleArrow!: SVGPolygonElement;
  #scaleShadow!: SVGPolygonElement;
  #scaleTick!: SVGLineElement;
  #scaleGroup!: SVGGElement;
  #envelope!: SVGPolygonElement;
  #label!: SVGTextElement;

  constructor() {
    super();
    this.defineTemplate(`
      <style>
        :host {
          display: inline-block;
          line-height: 0;
          touch-action: none;
          user-select: none;
        }
        svg { display: block; }
      </style>
      <svg xmlns="http://www.w3.org/2000/svg">
        <rect class="bias-bg"/>
        <rect class="track"/>
        <line class="zero-tick"/>
        <polygon class="perturb-arrow"/>
        <g class="scale-group">
          <rect class="scale-backing"/>
          <polygon class="scale-shadow"/>
          <polygon class="scale-arrow"/>
          <line class="scale-tick"/>
        </g>
        <polygon class="envelope"/>
        <text class="label"/>
      </svg>
    `);
    const root = this.root;
    this.#svg = root.querySelector("svg") as SVGSVGElement;
    this.#biasBg = root.querySelector(".bias-bg") as SVGRectElement;
    this.#track = root.querySelector(".track") as SVGRectElement;
    this.#zeroTick = root.querySelector(".zero-tick") as SVGLineElement;
    this.#perturbArrow = root.querySelector(".perturb-arrow") as SVGPolygonElement;
    this.#scaleGroup = root.querySelector(".scale-group") as SVGGElement;
    this.#scaleBacking = root.querySelector(".scale-backing") as SVGRectElement;
    this.#scaleArrow = root.querySelector(".scale-arrow") as SVGPolygonElement;
    this.#scaleShadow = root.querySelector(".scale-shadow") as SVGPolygonElement;
    this.#scaleTick = root.querySelector(".scale-tick") as SVGLineElement;
    this.#envelope = root.querySelector(".envelope") as SVGPolygonElement;
    this.#label = root.querySelector(".label") as SVGTextElement;

    // Static styling
    this.#biasBg.setAttribute("fill", BIAS_BG_FILL);
    this.#track.setAttribute("fill", TRACK_FILL);
    this.#zeroTick.setAttribute("stroke", TICK_COLOR);
    this.#zeroTick.setAttribute("stroke-width", "1");
    this.#perturbArrow.setAttribute("fill", PERTURB_FILL);
    this.#scaleBacking.setAttribute("fill", "rgba(0, 0, 0, 0.85)");
    this.#scaleArrow.setAttribute("fill", SCALE_FILL);
    this.#scaleShadow.setAttribute("fill", PERTURB_FILL);
    this.#scaleTick.setAttribute("stroke", TICK_COLOR);
    this.#scaleTick.setAttribute("stroke-width", "1");
    this.#envelope.setAttribute("fill", "none");
    this.#envelope.setAttribute("stroke", ENVELOPE_STROKE);
    this.#envelope.setAttribute("stroke-width", "1.5");
    this.#label.setAttribute("fill", LABEL_FILL);
    this.#label.setAttribute("font-size", "11");
    this.#label.setAttribute("font-family", "ui-monospace, monospace");

    this.addEventListener("pointerdown", this.#onPointerDown);
    this.addEventListener("dblclick", this.#onDoubleClick);
  }

  override connectedCallback(): void {
    this.#syncAttrs();
    this.#redrawAll();
  }

  override attributeChangedCallback(): void {
    if (!this.isConnected) return;
    this.#syncAttrs();
    this.#redrawAll();
  }

  setPerturbedValue(v: number): void {
    if (v === this.#perturbedValue) return;
    this.#perturbedValue = clip1(v);
    this.#redrawPerturbArrow();
  }

  setPerturbation(p: number): void {
    if (p === this.#perturbation) return;
    this.#perturbation = clip1(p);
    this.#redrawScaleShadow();
  }

  setBias(v: number): void {
    const clamped = clip1(v);
    if (clamped === this.#bias) return;
    this.#bias = clamped;
    this.#redrawAll();
  }

  setScale(v: number): void {
    const clamped = clip1(v);
    if (clamped === this.#scale) return;
    this.#scale = clamped;
    this.#redrawAll();
  }

  // ─── Geometry constants (derived per attr change) ────────────────────────

  #biasHeight = 0;
  #biasTop = 0;
  #biasMid = 0;
  #midX = 0;
  #thumbSize = 0;
  #trackHeight = 0;
  #trackLeft = 0;
  #trackLen = 0;
  #trackMidY = 0;
  #scaleSliderHeight = 0;
  #scaleSliderWidth = 0;
  #scaleSliderMidY = 0;

  #syncAttrs(): void {
    this.#w = this.numAttr("width", 256);
    this.#h = this.numAttr("height", 80);
    this.#bias = clip1(this.numAttr("bias", this.#bias));
    this.#scale = clip1(this.numAttr("scale", this.#scale));

    this.#biasHeight = Math.round((2 * this.#h) / 4);
    this.#biasTop = this.#h - this.#biasHeight;
    this.#biasMid = Math.round((this.#biasHeight + this.#h) / 2);
    this.#midX = Math.round(this.#w / 2);
    this.#thumbSize = Math.round(this.#biasHeight / 4);
    this.#trackHeight = Math.round(this.#biasHeight / 5);
    this.#trackLeft = this.#thumbSize;
    this.#trackLen = this.#w - 2 * this.#trackLeft;
    this.#trackMidY = Math.round(this.#biasTop + this.#biasHeight / 2);
    this.#scaleSliderHeight = this.#h - this.#biasHeight;
    this.#scaleSliderWidth = Math.round(this.#w / 2);
    this.#scaleSliderMidY = Math.round(this.#scaleSliderHeight / 2);

    this.#svg.setAttribute("width", String(this.#w));
    this.#svg.setAttribute("height", String(this.#h));
    this.#svg.setAttribute("viewBox", `0 0 ${this.#w} ${this.#h}`);
  }

  #redrawAll(): void {
    // Bias background
    this.#biasBg.setAttribute("x", "0");
    this.#biasBg.setAttribute("y", String(this.#biasTop));
    this.#biasBg.setAttribute("width", String(this.#w));
    this.#biasBg.setAttribute("height", String(this.#biasHeight));

    // Track
    this.#track.setAttribute("x", String(this.#trackLeft));
    this.#track.setAttribute("y", String(this.#trackMidY - this.#trackHeight / 2));
    this.#track.setAttribute("width", String(this.#trackLen));
    this.#track.setAttribute("height", String(this.#trackHeight));

    // Zero tick (vertical line at midX through bias area)
    this.#zeroTick.setAttribute("x1", String(this.#midX));
    this.#zeroTick.setAttribute("x2", String(this.#midX));
    this.#zeroTick.setAttribute("y1", String(this.#biasTop));
    this.#zeroTick.setAttribute("y2", String(this.#h));

    // Scale slider position: shift horizontally based on bias
    const scaleSliderLeft = Math.round(((this.#w - this.#scaleSliderWidth) * (1 + this.#bias)) / 2);
    this.#scaleGroup.setAttribute("transform", `translate(${scaleSliderLeft}, 0)`);
    this.#scaleBacking.setAttribute("x", "0");
    this.#scaleBacking.setAttribute("y", "0");
    this.#scaleBacking.setAttribute("width", String(this.#scaleSliderWidth));
    this.#scaleBacking.setAttribute("height", String(this.#scaleSliderHeight));

    // Scale arrow inside the scale group
    const ssMidX = this.#scaleSliderWidth / 2;
    const ssLeft = Math.round(ssMidX - this.#scale * ssMidX);
    const ssRight = Math.round(ssMidX + this.#scale * ssMidX);
    this.#scaleArrow.setAttribute(
      "points",
      `${ssLeft},0 ${ssRight},${this.#scaleSliderMidY} ${ssLeft},${this.#scaleSliderHeight}`,
    );

    // Scale tick (centre vertical inside scale group)
    this.#scaleTick.setAttribute("x1", String(ssMidX));
    this.#scaleTick.setAttribute("x2", String(ssMidX));
    this.#scaleTick.setAttribute("y1", "0");
    this.#scaleTick.setAttribute("y2", String(this.#scaleSliderHeight));

    // Label
    const label = this.strAttr("label");
    if (label) {
      this.#label.textContent = label;
      this.#label.setAttribute("x", "4");
      this.#label.setAttribute("y", String(this.#h - 4));
    } else {
      this.#label.textContent = "";
    }

    // Envelope: from bias-perturbed extremes through scale-slider centre.
    // The extremes assume |signal| = 1 in either direction — visualises the
    // maximum modulation depth boundary regardless of current signal value.
    const leftmostPerturb = Math.round(
      this.#midX + (this.#trackLen * copula([this.#bias, this.#scale])) / 2,
    );
    const rightmostPerturb = Math.round(
      this.#midX + (this.#trackLen * copula([this.#bias, -this.#scale])) / 2,
    );
    const scaleSliderMidXAbs = scaleSliderLeft + ssMidX;
    this.#envelope.setAttribute(
      "points",
      `${leftmostPerturb},${this.#trackMidY} ${scaleSliderMidXAbs},${this.#scaleSliderMidY} ${rightmostPerturb},${this.#trackMidY}`,
    );

    this.#redrawPerturbArrow();
    this.#redrawScaleShadow();
  }

  #redrawPerturbArrow(): void {
    if (this.#trackLen === 0) return;
    const biasThumbX = Math.round(this.#midX + (this.#trackLen / 2) * this.#bias);
    const perturbedX = Math.round(this.#midX + (this.#trackLen * this.#perturbedValue) / 2);
    const top = this.#biasMid - this.#thumbSize;
    const bottom = this.#biasMid + this.#thumbSize;
    this.#perturbArrow.setAttribute(
      "points",
      `${biasThumbX},${top} ${perturbedX},${this.#trackMidY} ${biasThumbX},${bottom}`,
    );
  }

  #redrawScaleShadow(): void {
    if (this.#scaleSliderWidth === 0) return;
    const ssMidX = this.#scaleSliderWidth / 2;
    const tip = Math.round(ssMidX + this.#perturbation * ssMidX);
    this.#scaleShadow.setAttribute(
      "points",
      `${ssMidX},0 ${tip},${this.#scaleSliderMidY} ${ssMidX},${this.#scaleSliderHeight}`,
    );
  }

  // ─── Pointer drag ─────────────────────────────────────────────────────────

  #onPointerDown = (e: PointerEvent): void => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.preventDefault();
    const rect = this.getBoundingClientRect();
    const localY = e.clientY - rect.top;

    // Top half = scale, bottom half = bias.
    const isScale = localY < this.#biasTop;
    this.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startBias = this.#bias;
    const startScale = this.#scale;
    const move = (ev: PointerEvent) => {
      // Bias drag is normalised across full width; scale drag across half-width.
      const denom = isScale ? this.#scaleSliderWidth : this.#w;
      const delta = (2 * (ev.clientX - startX)) / denom;
      if (isScale) {
        const v = clip1(startScale + delta);
        if (v !== this.#scale) {
          this.#scale = v;
          this.#redrawAll();
          this.#emit("scale-change", v);
        }
      } else {
        const v = clip1(startBias + delta);
        if (v !== this.#bias) {
          this.#bias = v;
          this.#redrawAll();
          this.#emit("bias-change", v);
        }
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

  #onDoubleClick = (e: MouseEvent): void => {
    const rect = this.getBoundingClientRect();
    const localY = e.clientY - rect.top;
    if (localY < this.#biasTop) {
      // scale → 0
      this.#scale = 0;
      this.#redrawAll();
      this.#emit("scale-change", 0);
    } else {
      // bias → 0
      this.#bias = 0;
      this.#redrawAll();
      this.#emit("bias-change", 0);
    }
  };

  #emit(kind: "bias-change" | "scale-change", value: number): void {
    this.dispatchEvent(new CustomEvent(kind, { detail: { value } }));
    this.dispatchEvent(new CustomEvent("change", { detail: { kind, value } }));
  }
}

defineOnce("syn-archimedean-slider", SynArchimedeanSlider);
