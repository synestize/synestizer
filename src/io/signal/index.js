import Rx from 'rxjs/Rx'
import setop from '../../lib/setop.js'
import transform from '../../lib/transform.js'
import { addSourceSignal, removeSourceSignal, setSourceSignalValue, setAllSourceSignalValues, addSinkSignal, removeSinkSignal, setSinkSignalValue, setAllSinkSignalValue, setSourceSinkScale, setSinkBias } from '../../actions/signal'
import { toObservable } from '../../lib/rx_redux'
import React from 'react'

typeof window !== "undefined" && (window.React = React); // for devtools

/*
internal state handles high-speed source updates and periodic sink updates and UI updates
*/

export default function init(store) {
  const storeStream = toObservable(store);
  const sourceSubject = new Rx.Subject();
  const sinkSubject = new Rx.Subject();

  let sourceState = {}
  let sinkState = {}

  sourceSubject.subscribe((upd)=>sourceState = {...sourceState, ...upd})
  //sourceSubject.subscribe((upd)=>console.debug( sourceState))
  /*{
     sourceSignalMeta,
     sourceSignalValues,
     sinkSignalMeta,
     sinkSignalValues,
     sourceSinkScale,
     sinkBias
  }*/
  storeStream.pluck(
    'signal', 'sourceSinkScale'
  ).distinctUntilChanged().subscribe(
    (scale) => {
      console.log("signal", scale);
    }
  )

  return {
    sourceSubject,
    sinkSubject,
  }
}
