/**
 * `<syn-meter>` — Canvas-based bipolar meter.
 *
 * Cheap to redraw (60×16 px each), so we just clear+repaint each rAF rather
 * than try to preserve state. Bipolar: positive values fill from center
 * rightward; negative values fill from center leftward, in a contrasting
 * colour.
 *
 * Driving the value:
 *   - `setValue(n)` from a parent's rAF loop is the recommended path —
 *     it lets one rAF coordinate many meters, which is cheaper than each
 *     meter running its own.
 *   - As a fallback for standalone use, the `value` attribute is honoured
 *     (string→number) and triggers a single repaint.
 *
 * Attributes:
 *   width  (px, default 80)
 *   height (px, default 14)
 *   orientation  "horizontal" (default) | "vertical"
 *   value  number in [-1, 1]
 */

import { defineOnce, SynElement } from "./base.ts";

const POS_FILL = "#3aaaff";
const NEG_FILL = "#ff6633";
const BG = "#1a1a1a";
const ZERO_LINE = "#444";

export class SynMeter extends SynElement {
  static readonly observedAttributes = ["value", "width", "height", "orientation"];

  #canvas: HTMLCanvasElement;
  #ctx: CanvasRenderingContext2D;
  #value = 0;
  #w = 80;
  #h = 14;
  #vertical = false;
  #dirty = true;

  constructor() {
    super();
    this.defineTemplate(`
      <style>
        :host { display: inline-block; line-height: 0; }
        canvas { display: block; }
      </style>
      <canvas></canvas>
    `);
    this.#canvas = this.root.querySelector("canvas") as HTMLCanvasElement;
    this.#ctx = this.#canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  override connectedCallback(): void {
    this.#syncAttrs();
    this.#paint();
  }

  override attributeChangedCallback(): void {
    if (!this.isConnected) return;
    this.#syncAttrs();
    this.#paint();
  }

  /** Imperative setter for parent-driven rAF coordination. */
  setValue(v: number): void {
    if (v === this.#value) return;
    this.#value = v;
    this.#dirty = true;
    this.#paint();
  }

  #syncAttrs(): void {
    const w = this.numAttr("width", 80);
    const h = this.numAttr("height", 14);
    const orient = this.strAttr("orientation", "horizontal");
    const v = this.numAttr("value", this.#value);

    if (w !== this.#w || h !== this.#h) {
      this.#w = w;
      this.#h = h;
      this.#canvas.width = w;
      this.#canvas.height = h;
      this.#dirty = true;
    }
    const vertical = orient === "vertical";
    if (vertical !== this.#vertical) {
      this.#vertical = vertical;
      this.#dirty = true;
    }
    if (v !== this.#value) {
      this.#value = v;
      this.#dirty = true;
    }
  }

  #paint(): void {
    if (!this.#dirty) return;
    const ctx = this.#ctx;
    const w = this.#w;
    const h = this.#h;
    const v = this.#value < -1 ? -1 : this.#value > 1 ? 1 : this.#value;

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);

    if (this.#vertical) {
      const midY = h / 2;
      if (v >= 0) {
        const fillH = v * midY;
        ctx.fillStyle = POS_FILL;
        ctx.fillRect(0, midY - fillH, w, fillH);
      } else {
        const fillH = -v * midY;
        ctx.fillStyle = NEG_FILL;
        ctx.fillRect(0, midY, w, fillH);
      }
      ctx.fillStyle = ZERO_LINE;
      ctx.fillRect(0, midY, w, 1);
    } else {
      const midX = w / 2;
      if (v >= 0) {
        const fillW = v * midX;
        ctx.fillStyle = POS_FILL;
        ctx.fillRect(midX, 0, fillW, h);
      } else {
        const fillW = -v * midX;
        ctx.fillStyle = NEG_FILL;
        ctx.fillRect(midX - fillW, 0, fillW, h);
      }
      ctx.fillStyle = ZERO_LINE;
      ctx.fillRect(midX, 0, 1, h);
    }
    this.#dirty = false;
  }
}

defineOnce("syn-meter", SynMeter);
