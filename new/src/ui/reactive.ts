/**
 * Tiny binding primitives for `<syn-*>` Web Components.
 *
 * Two flavors of binding:
 *   - bindConfig(el, store, path, apply) → fires on ConfigStore change.
 *   - bindSignal(el, getValue, apply)    → fires on rAF, reading a SignalBus
 *     slot directly.
 *
 * Both return an unsubscribe. SynElement.onDisconnect() consumes them.
 *
 * The split mirrors the iron rule: config-rate state goes through the store;
 * signal-rate values come straight off the typed bus and never round-trip.
 */

import type { ConfigStore } from "../store/config-store.ts";

export function bindConfig<T = unknown>(
  store: ConfigStore,
  path: string,
  apply: (value: T) => void,
): () => void {
  // Initial pump
  apply(store.get(path) as T);
  return store.subscribe(path, (value) => {
    apply(value as T);
  });
}
