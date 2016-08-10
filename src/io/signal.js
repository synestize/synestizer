import Rx from 'rxjs/Rx'
import transform from '../lib/transform.js'
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

typeof window !== "undefined" && (window.React = React); // for devtools

/*
internal state handles high-speed source updates and periodic sink updates and UI updates
*/

export default function init(store) {
  const storeStream = toObservable(store);
  const sourceUpdates = new Rx.Subject();

  // sourceUpdates.subscribe((x)=>console.debug('sigstate2', x))
  const sourceStateSubject = sourceUpdates.scan(
    (sourceState, upd)=>({...sourceState, ...upd}),
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
  // This is prolly unnecessary
  storeStream.pluck(
    'signal', 'sourceSinkScale'
  ).distinctUntilChanged().subscribe(
    (scale) => {
      console.log("signal", scale);
    }
  )
  function projectObs(source) {
    // console.debug('project', source);
    return source
  }

  return {
    sourceUpdates,
    sinkStateSubject,
  }
}
