import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { scan } from 'rxjs/operator/scan';
import { sampleTime } from 'rxjs/operator/sampleTime';

import { saturate, desaturate } from '../lib/transform.js'
import {
  setAllSourceSignalValues,
  setAllSinkSignalValues,
  addGenericSinkSignal,
  removeGenericSinkSignal,
} from '../actions/signal'
import { toObservable } from '../lib/rx_redux'
import React from 'react'
import {SIGNAL_PERIOD_MS, UI_PERIOD_MS } from '../settings'

/*
internal state handles high-speed source updates and periodic sink updates and UI updates
*/

export default function init(store) {
  const storeStream = toObservable(store);
  const sourceUpdates = new Subject();

  const sourceStateSubject = new BehaviorSubject();
  const sinkStateSubject = new BehaviorSubject();
  const comboStateSubject = new BehaviorSubject();

  sourceUpdates::scan(
    (sourceState, upd) => ({...sourceState, ...upd}),
    {}
  )::sampleTime(SIGNAL_PERIOD_MS).subscribe(
    (sourceState) => {
      sourceStateSubject.next(sourceState)
    }
  )
  sourceStateSubject::sampleTime(UI_PERIOD_MS).subscribe((state) => {
    store.dispatch(setAllSourceSignalValues(state))
  });
  sourceStateSubject.subscribe(
    (sourceState)=>{
      const sinkState = projectObs(sourceState)
      sinkStateSubject.next(sinkState)
      comboStateSubject.next({...sourceState, ...sinkState})
    }
  )
  sinkStateSubject::sampleTime(UI_PERIOD_MS).subscribe((sinkState) => {
    store.dispatch(setAllSinkSignalValues(sinkState))
  });
  function projectObs(sourceState={}) {
    const sourceSinkScale = store.getState().signal.sourceSinkScale;
    const sourceStateT = {}
    const sinkState = {}
    // temporary tanh-transformed sink vals
    const sinkStateT = {}
    for (let key in sourceSinkScale) {
      let scale = sourceSinkScale[key];
      let [sourceAddress, sinkAddress] = key.split("/");
      let sourceVal = sourceState[sourceAddress] || 0.0;
      let delta = scale * desaturate(sourceVal);

      if (delta !== 0.0) {
        sinkStateT[sinkAddress] = delta + (
          sinkStateT[sinkAddress] || 0.0
        )
      };
    };
    for (let sinkAddress in sinkStateT) {
      sinkState[sinkAddress] = saturate(sinkStateT[sinkAddress]);
    };
    // console.debug('sinkState', sinkState)
    return sinkState
  }
  storeStream.pluck(
    'signal', 'nGenericSinkSignals'
  ).distinctUntilChanged().subscribe(
    (n) => {
      let sinkSignalMeta = store.getState().signal.sinkSignalMeta;
      const currN = Object.keys(
        sinkSignalMeta
      ).filter((k)=>(sinkSignalMeta[k].owner==="Signal")).length;
      // console.debug('signalpub', n, currN)
      if (currN<n) {
        for (let i=currN; i<n; i++) {
          // console.debug('signaladd', i)
          store.dispatch(addGenericSinkSignal(i))
        }
      } else if (currN>n) {
        for (let i=n; i<currN; i++) {
          // console.debug('signaldel', i)
          store.dispatch(removeGenericSinkSignal(i))
        }
      }
    }
  )
  return {
    sourceUpdates,
    sourceStateSubject,
    sinkStateSubject,
    comboStateSubject,
  }
}
