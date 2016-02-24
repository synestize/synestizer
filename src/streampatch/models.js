'use strict';
// A supply of control data streams
// for other models to actually supply or use

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');

// internal state is high speed
var sourceFirehoses = new Map();
var sinkFirehoses = new Map();
var sourceSinkMapping = new Map();

//values of individual controls
var sourceState = window.streamPatchState = new Map();
var sourceStateSubject = new Rx.BehaviorSubject(sourceState);
var sinkState = window.sinkPatchState = new Map();
var sinkStateSubject = new Rx.BehaviorSubject(sinkState);

// UI state; control vals are throttled
// We treat these differently than raw data flows
// we really don't want to have datasreams re-render the DOM after every update
var state = new Map([
  ["sourceState", sourceState],
  ["sinkState", sinkState],
  ["sourceFirehoses", sourceFirehoses],
  ["sinkFirehoses", sinkFirehoses],
  ["sourceSinkMapping", sourceSinkMapping]
]);
console.debug("state", state);
var stateSubject = new Rx.BehaviorSubject(state);
var updateSubject = new Rx.Subject();
//update UI state object through updateSubject
updateSubject.subscribe(function (upd) {
  var newState;
  console.debug("upd", upd);
  newState = update(state, upd);
  console.debug("upUPd", state, newState);

  state = newState;
  
  stateSubject.onNext(state);
});

sourceStateSubject.throttle(200).subscribe(
  (state) => updateSubject.onNext({sourceState: {$set: state}})
);
sinkStateSubject.throttle(200).subscribe(
  (state) => updateSubject.onNext({sinkState: {$set: state}})
);


function registerSource(key, observable){
  sourceFirehoses.set(key, observable);
  updateSubject.onNext({sourceFirehoses: {$set: sourceFirehoses}})
  observable.subscribe(
    function ([key, val]) {
      console.debug("upppp", key, val);
      let upd = {};
      upd[key] = {$set: val};
      sourceState = update(sourceState, upd);
      window.sourceState = sourceState;
      sourceStateSubject.onNext(sourceState);
    }
  );
}
function registerSink(key, observer){
  let subject = new Rx.Subject();
  sinkFirehoses.set(key, subject);
  updateSubject.onNext({sinkFirehoses: {$set: sinkFirehoses}})

  subject.subscribe(
    function ([key, val]) {
      let upd = {};
      upd[key] = {$set: val};
      sinkState = update(sinkState, upd);
      sinkStateSubject.onNext(sinkState);
    }
  );
  subject.subscribe(observer);
}
function setSourceAddressesFor(key, addressList){
  console.debug("ss", key, addressList);
  for (let address of sourceState.keys()) {
    if (address[0]==key && !addressList.has(address)) {
      console.debug("ssd", key, address);
      sourceState.delete(address)
    }
  }
  let extantAddresses = new Set(sourceState.keys());
  for (let address of addressList) {
    if (!extantAddresses.has(address)) {
      console.debug("ssa", key, address);
      sourceState.set(address, 0.0);
      console.debug("ssb", sourceState.get(address));
    }
  }
  sourceStateSubject.onNext(sourceState);
  console.debug("ssc", sourceState, window.sourceState);
}
function setSinkAddressesFor(key, addressList){
  for (let address of sinkState.keys()) {
    if (address[0]==key) {sinkState.delete(address)}
  }
  for (let address of addressList) {
    sinkState.set(address, null)
  }
}
function addSourceAddress(address){}
function removeSourceAddress(address){}
function addSinkAddress(address){}
function removeSinkAddress(address){}
function setMapping(sourceKey, sinkKey, scale){}


module.exports = {
  sourceStateSubject: sourceStateSubject,
  sourceFirehoses: sourceFirehoses,
  sinkStateSubject: sinkStateSubject,
  sinkFirehoses: sinkFirehoses,
  registerSource: registerSource,
  registerSink: registerSink,
  setSourceAddressesFor: setSourceAddressesFor,
  setSinkAddressesFor: setSinkAddressesFor,
  addSourceAddress: addSourceAddress,
  removeSourceAddress: removeSourceAddress,
  addSinkAddress: addSinkAddress,
  removeSinkAddress: removeSourceAddress,
  setMapping: setMapping,
  stateSubject: stateSubject,
  updateSubject: updateSubject
};