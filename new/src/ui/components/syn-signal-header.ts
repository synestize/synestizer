/**
 * `<syn-signal-header>` — label + bipolar magnitude bar for a single signal.
 *
 * Used as patch-matrix row labels (per-source magnitude) and column headers
 * (per-generic magnitude). The same primitive in two orientations:
 *
 *   row    — [×] [label  ──────] [-bar+]      (text on left, bar on right)
 *   column —   [α]                            (text on top)
 *             [-bar+]                          (bar below)
 *
 * The cell is "controlled" — parent calls setValue() on rAF. No subscription
 * machinery. The optional × button fires a "remove" CustomEvent so the parent
 * can scrub the row from the store.
 */

import { defineOnce, SynElement } from "./base.ts";

const POS_FILL = "rgba(60, 170, 255, 0.85)";
const NEG_FILL = "rgba(255, 102, 51, 0.85)";

export class SynSignalHeader extends SynElement {
  static readonly observedAttributes = ["label", "orientation", "removable", "title-text"];

  #value = 0;
  #posFill!: HTMLElement;
  #negFill!: HTMLElement;
  #labelEl!: HTMLElement;
  #removeBtn!: HTMLButtonElement | null;
  #wrap!: HTMLElement;

  constructor() {
    super();
    this.defineTemplate(`
      <style>
        :host { display: inline-block; font-family: system-ui, sans-serif; color: #ccc; font-size: 0.85rem; }
        :host([orientation="column"]) .wrap {
          display: flex; flex-direction: column; align-items: stretch; gap: 2px; min-width: 60px;
        }
        :host([orientation="column"]) .label { text-align: center; font-weight: bold; }
        :host([orientation="column"]) .bar { width: 100%; height: 6px; }

        :host(:not([orientation="column"])) .wrap {
          display: flex; align-items: center; gap: 0.4em;
        }
        :host(:not([orientation="column"])) .label {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        :host(:not([orientation="column"])) .bar { width: 50px; height: 6px; }

        .wrap { line-height: 1; }
        .bar {
          position: relative;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid #2a2a2a;
        }
        .bar::after {
          content: "";
          position: absolute; left: 50%; top: 0; bottom: 0;
          width: 1px; background: rgba(255, 255, 255, 0.15);
        }
        .pos, .neg {
          position: absolute; top: 0; bottom: 0;
          width: 0%;
        }
        .pos { left: 50%; }
        .neg { right: 50%; }

        button.remove {
          background: transparent;
          color: #888;
          border: 1px solid #333;
          width: 1.4em;
          height: 1.4em;
          padding: 0;
          margin-right: 0.25em;
          font: inherit;
          cursor: pointer;
          border-radius: 50%;
          line-height: 1;
        }
        button.remove:hover { color: #f55; border-color: #f55; }
      </style>
      <div class="wrap">
        <span class="label"></span>
        <div class="bar">
          <div class="neg"></div>
          <div class="pos"></div>
        </div>
      </div>
    `);
    this.#wrap = this.root.querySelector(".wrap") as HTMLElement;
    this.#labelEl = this.root.querySelector(".label") as HTMLElement;
    this.#posFill = this.root.querySelector(".pos") as HTMLElement;
    this.#negFill = this.root.querySelector(".neg") as HTMLElement;
    this.#posFill.style.background = POS_FILL;
    this.#negFill.style.background = NEG_FILL;
    this.#removeBtn = null;
  }

  override connectedCallback(): void {
    this.#syncAttrs();
    this.#redrawValue();
  }

  override attributeChangedCallback(): void {
    if (!this.isConnected) return;
    this.#syncAttrs();
  }

  /** Imperative setter for parent rAF coordination. */
  setValue(v: number): void {
    if (v === this.#value) return;
    this.#value = v;
    this.#redrawValue();
  }

  #syncAttrs(): void {
    this.#labelEl.textContent = this.strAttr("label");
    const titleText = this.strAttr("title-text");
    if (titleText) this.#labelEl.title = titleText;

    const removable = this.hasAttribute("removable");
    if (removable && this.#removeBtn === null) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "remove";
      btn.textContent = "×";
      btn.title = "Remove";
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent("remove", { bubbles: true, composed: true }));
      });
      this.#wrap.insertBefore(btn, this.#labelEl);
      this.#removeBtn = btn;
    } else if (!removable && this.#removeBtn !== null) {
      this.#removeBtn.remove();
      this.#removeBtn = null;
    }
  }

  #redrawValue(): void {
    const v = this.#value < -1 ? -1 : this.#value > 1 ? 1 : this.#value;
    if (v >= 0) {
      this.#posFill.style.width = `${v * 50}%`;
      this.#negFill.style.width = "0%";
    } else {
      this.#negFill.style.width = `${-v * 50}%`;
      this.#posFill.style.width = "0%";
    }
  }
}

defineOnce("syn-signal-header", SynSignalHeader);
