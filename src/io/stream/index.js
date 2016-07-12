import Rx from 'rx'
import update from 'react-addons-update'
import setop from '../../lib/setop.js'
import transform from '../../lib/transform.js'
import { addSourceStream, removeSourceStream, setSourceStreamValue, setAllSourceStreamValues, addSinkStream, removeSinkStream, setSinkStreamValue, setAllSinkStreamValue, setSourceSinkScale, setSinkBias } from '../../actions/stream'
import { toObservable } from '../../lib/rx_redux'

/*
internal state handles high-speed source updates and slower sink updates
*/

export default function init(store) {
  const storeStream = toObservable(store);
  /*{
     sourceStreamMeta,
     sourceStreamValues,
     sinkStreamMeta,
     sinkStreamValues,
     sourceSinkScale,
     sinkBias
  }*/
  storeStream.pluck('stream', 'sourceSinkScale').distinctUntilChanged().subscribe(
    (scale) => {
      console.log("stream", scale);
    }
  )

  return {}
}
