import {Observable} from 'rxjs/Observable'

// https://github.com/reactjs/redux/issues/303#issuecomment-125184409\
/*
export function toObservable(store) {
  return {
    subscribe({ next }) {
      let dispose = store.subscribe(() => next(store.getState()));
      next(store.getState());
      return { dispose };
    }
  }
}
*/

// https://github.com/Reactive-Extensions/RxJS/blob/master/doc/howdoi/wrap.md
export function toObservable(store) {
  return Observable.create(function (observer) {
    return store.subscribe(() => observer.next(store.getState()));
  });
}
