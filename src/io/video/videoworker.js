import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/observable/fromEvent';
import * as statModels from './statModels'
const liveStatistics = {};
let busyFlag = false;

const inbox = Observable.fromEvent(self, "message").map((e) => e.data);
const outbox = new Subject();

outbox.subscribe((msg)=>{
  self.postMessage(msg)
});

inbox.filter((x)=>(x.type==="settings")).subscribe(function({type, payload}) {
  // console.debug("settings", type, payload);
  /*
  Theoretically we can initialise stats with different params
  which would get different numbers of params,
  so we pass metadata back to the main thread from here
  */
  let signalKeys = {};
  let signalNames = {};
  for (let statKey of Object.keys(liveStatistics)) {
    delete liveStatistics[statKey]
  }
  for (let statKey of Object.keys(payload.statModels)) {
    let params = payload.statModels;
    let {fn, keys, names} = statModels[statKey](params)
    liveStatistics[statKey]= fn;
    signalKeys[statKey] = keys;
    signalNames[statKey] = names;
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
  if (!busyFlag) {
    busyFlag = true;
    const results = {};
    for (let statKey of Object.keys(liveStatistics)) {
      results[statKey] = liveStatistics[statKey](payload);
    };
    outbox.next({
      type: "results",
      payload: results
    });
    busyFlag = false;
  }
});
