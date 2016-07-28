import Rx from 'rx'
import update from 'react-addons-update'
import setop from '../../lib/setop.js'
import transform from '../../lib/transform.js'
import { addSourceSignal, removeSourceSignal, setSourceSignalValue, setAllSourceSignalValues, addSinkSignal, removeSinkSignal, setSinkSignalValue, setAllSinkSignalValue, setSourceSinkScale, setSinkBias } from '../../actions/signal'
import { toObservable } from '../../lib/rx_redux'
import React from 'react'

typeof window !== "undefined" && (window.React = React); // for devtools

/*
internal state handles high-speed source updates and slower sink updates
*/

export default function init(store) {
  const storeStream = toObservable(store);
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
      console.log("stream", scale);
    }
  )

  return {
    sourceSubject,
    sinkSubject,
  }
}
