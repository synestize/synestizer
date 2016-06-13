// https://github.com/reactjs/redux/issues/303#issuecomment-125184409
export function toObservable(store) {
  return {
    subscribe({ onNext }) {
      let dispose = store.subscribe(() => onNext(store.getState()));
      onNext(store.getState());
      return { dispose };
    }
  }
}
