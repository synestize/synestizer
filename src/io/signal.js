import Rx from 'rxjs/Rx'
import { saturate, desaturate } from '../lib/transform.js'
import {
  addSourceSignal,
  removeSourceSignal,
  setSourceSignalValue,
  setAllSourceSignalValues,
  addSinkSignal,
  removeSinkSignal,
  setSinkSignalValue,
  setAllSinkSignalValues,
  setSourceSinkScale,
  setSinkBias
} from '../actions/signal'
import { toObservable } from '../lib/rx_redux'
import React from 'react'

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
  ).throttleTime(1000).share();
  // sourceStateSubject.subscribe((x)=>console.debug('sigstate3', x))
  sourceStateSubject.subscribe((vals) => {
    store.dispatch(setAllSourceSignalValues(vals))
  });
  const sinkStateSubject = sourceStateSubject.map(projectObs).share();
  sinkStateSubject.subscribe((vals) => {
    store.dispatch(setAllSinkSignalValues(vals))
  });
  /*{
     sourceSignalMeta,
     sourceSignalValues,
     sinkSignalMeta,
     sinkSignalValues,
     sourceSinkScale,
     sinkBias
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
      console.debug('dd', key, sourceAddress, sinkAddress, scale)
      let sourceVal = sourceVals[sourceAddress] || 0.0;
      let delta = scale * desaturate(sourceVal);
      console.debug('ee', delta, scale, desaturate(sourceVal))

      if (delta !== 0.0) {
        sinkValsT[sinkAddress] = delta + (
          sinkValsT[sinkAddress] || 0.0
        )
      };
    };
    console.debug('sinkValsT', sinkValsT)
    for (let sinkAddress in sinkValsT) {
      sinkVals[sinkAddress] = saturate(sinkValsT[sinkAddress]);
    };
    console.debug('sinkVals', sinkVals)
    return sinkVals
  }

  return {
    sourceUpdates,
    sinkStateSubject,
  }
}
