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
  const sourceUpdates = new Rx.Subject();
  const sourceStateSubject = new Rx.Subject();

  let sourceState = {}
  let sinkState = {}

  sourceUpdates.subscribe((upd)=>{
    //maybe there is already a merge operator for this? yes, scan.
    //http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-scan
    sourceState = {...sourceState, ...upd}
    sourceStateSubject.next(sourceState)
  })
  const sinkObs = sourceStateSubject.throttle(50).map(projectSources).share();

  //sourceUpdates.subscribe((upd)=>console.debug( sourceState))
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
  function projectObs(source) {}

  return {
    sourceUpdates,
    sinkObs,
  }
}
