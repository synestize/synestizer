
import Rx from 'rxjs/Rx';
import * as statModels from './statModels'
const liveStatistics = {};

const inbox = Rx.Observable.fromEvent(self, "message").map((e) => e.data);
const outbox = new Rx.Subject();

outbox.subscribe((msg)=>{
  self.postMessage(msg)
});

inbox.filter((x)=>(x.type==="settings")).subscribe(function({type, payload}) {
  // console.debug("settings", type, payload);
  // Theoretically we can initialise stats with different params whcih woudl get different numbers of params, so we pass metadata back to the main thread from here
  let signalKeys = {};
  let signalNames = {};
  for (let statKey of Object.keys(liveStatistics)) {
    delete liveStatistics[statKey]
  }
  for (let statKey of Object.keys(payload.statModels)) {
    let params = payload.statModels;
    let {fn, statSignalKeys, statSignalNames} = statModels[statKey](params)
    liveStatistics[statKey]= fn;
    signalKeys[statKey] = statSignalKeys;
    signalNames[statKey] = statSignalNames;
  }
  outbox.next({
    type: 'statmeta',
    payload:{
      signalKeys,
      signalNames
    }
  })
});

inbox.filter((x)=>(x.type==="pixels")).subscribe(function({type, payload}) {
  // console.debug("workerpixels", type, payload);
  const results = {};
  for (let statKey of Object.keys(liveStatistics)) {
    results[statKey] = liveStatistics[statKey](payload);
  };
  outbox.next({
    type: "results",
    payload: results
  });
});

export default {}
