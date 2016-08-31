import Rx from 'rxjs/Rx'
import { saturate, desaturate } from '../lib/transform.js'
import {
  setAllSourceSignalValues,
  setAllSinkSignalValues,
} from '../actions/signal'
import { toObservable } from '../lib/rx_redux'
import React from 'react'
import {SIGNAL_RATE, UI_RATE } from '../settings'

/*
internal state handles high-speed source updates and periodic sink updates and UI updates
*/

export default function init(store) {
  const storeStream = toObservable(store);
  const sourceUpdates = new Rx.Subject();

  // sourceUpdates.subscribe((x)=>console.debug('sigstate2', x))
  const sourceStateSubject = sourceUpdates.scan(
    (sourceState, upd) => ({...sourceState, ...upd}),
    {}
  ).throttleTime(SIGNAL_RATE).share();
  // sourceStateSubject.subscribe((x)=>console.debug('sigstate3', x))
  sourceStateSubject.throttleTime(UI_RATE).subscribe((vals) => {
    store.dispatch(setAllSourceSignalValues(vals))
  });
  const sinkStateSubject = sourceStateSubject.map(projectObs).share();
  sinkStateSubject.throttleTime(UI_RATE).subscribe((vals) => {
    store.dispatch(setAllSinkSignalValues(vals))
  });
  /*{
     sourceSignalMeta,
     sourceSignalValues,
     sinkSignalMeta,
     sinkSignalValues,
     sourceSinkScale
  }*/

  function projectObs(sourceVals) {
    // console.debug('project', source);
    const sourceSinkScale = store.getState().signal.sourceSinkScale;
    const sourceValsT = {}
    const sinkVals = {}
    // temporary tanh-transformed sink vals
    const sinkValsT = {}
    for (let key in sourceSinkScale) {
      let scale = sourceSinkScale[key];
      let [sourceAddress, sinkAddress] = key.split("/");
      let sourceVal = sourceVals[sourceAddress] || 0.0;
      let delta = scale * desaturate(sourceVal);

      if (delta !== 0.0) {
        sinkValsT[sinkAddress] = delta + (
          sinkValsT[sinkAddress] || 0.0
        )
      };
    };
    for (let sinkAddress in sinkValsT) {
      sinkVals[sinkAddress] = saturate(sinkValsT[sinkAddress]);
    };
    // console.debug('sinkVals', sinkVals)
    return sinkVals
  }

  return {
    sourceUpdates,
    sinkStateSubject,
  }
}
