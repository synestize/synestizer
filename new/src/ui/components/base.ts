/**
 * SynElement — base class for all `<syn-*>` Web Components.
 *
 * What it gives subclasses:
 *   - Shadow DOM with a static template string set via `defineTemplate(html)`.
 *   - Attribute reflection helpers (`numAttr`, `setNumAttr`).
 *   - A "subscribe until disconnected" helper so cleanup is automatic.
 *   - rAF loop helpers that auto-stop when the element leaves the DOM.
 *
 * Design notes that are easy to get wrong:
 *   - Subclasses must declare `static observedAttributes` themselves; the
 *     browser doesn't pick them up via inheritance for CE.
 *   - Use `attributeChangedCallback` (not setters) for attr → DOM updates.
 *     Setters won't fire when the attribute is set declaratively in HTML.
 *   - The shadow root is opened in the constructor; querying for nodes only
 *     works *after* `defineTemplate` has run (typically also in constructor).
 */

export class SynElement extends HTMLElement {
  protected readonly root: ShadowRoot;
  readonly #cleanups: Array<() => void> = [];
  #rafHandle = 0;
  #rafRunning = false;

  constructor() {
    super();
    this.root = this.attachShadow({ mode: "open" });
  }

  /** Set the shadow-root contents. Call from the subclass constructor. */
  protected defineTemplate(html: string): void {
    this.root.innerHTML = html;
  }

  /** Read a numeric attribute with a default. */
  protected numAttr(name: string, fallback: number): number {
    const v = this.getAttribute(name);
    if (v === null) return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  /** Read a string attribute. */
  protected strAttr(name: string, fallback = ""): string {
    return this.getAttribute(name) ?? fallback;
  }

  /**
   * Register a teardown to run on disconnect. Use for unsubscribing from
   * stores, removing global event listeners, etc.
   */
  protected onDisconnect(cleanup: () => void): void {
    this.#cleanups.push(cleanup);
  }

  /**
   * Run `paint` on every animation frame while connected. Stops on disconnect.
   * Safe to call once in `connectedCallback`; calling more than once is a bug.
   */
  protected startRaf(paint: () => void): void {
    if (this.#rafRunning) return;
    this.#rafRunning = true;
    const tick = () => {
      if (!this.#rafRunning) return;
      paint();
      this.#rafHandle = requestAnimationFrame(tick);
    };
    this.#rafHandle = requestAnimationFrame(tick);
  }

  // Custom Element lifecycle hooks — declared here so subclasses can use
  // `override`. At runtime these are real callbacks the browser invokes.
  connectedCallback(): void {
    /* subclasses override */
  }

  disconnectedCallback(): void {
    this.#rafRunning = false;
    cancelAnimationFrame(this.#rafHandle);
    for (const c of this.#cleanups) c();
    this.#cleanups.length = 0;
  }

  attributeChangedCallback(
    _name: string,
    _oldValue: string | null,
    _newValue: string | null,
  ): void {
    /* subclasses override */
  }
}

/**
 * Define a custom element if it isn't already defined. Hot-reload friendly:
 * Vite reload doesn't tear down customElements registrations, so re-defining
 * the same name throws. This guards.
 */
export function defineOnce(name: string, ctor: CustomElementConstructor): void {
  if (!customElements.get(name)) customElements.define(name, ctor);
}
