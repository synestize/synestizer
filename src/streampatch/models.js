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
var state =  {
  sourceState: sourceState,
  sinkState: sinkState,
  sourceFirehoses: sourceFirehoses,
  sinkFirehoses: sinkFirehoses,
  sourceSinkMapping: sourceSinkMapping
};
console.debug("state", state);
var stateSubject = new Rx.BehaviorSubject(state);
var updateSubject = new Rx.Subject();
//update UI state object through updateSubject
updateSubject.subscribe(function (upd) {
  var newState;
  newState = update(state, upd);
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
      sourceState.set(key, val);
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
      sinkState.set(key, val);
      sinkStateSubject.onNext(sinkState);
    }
  );
  subject.subscribe(observer);
}
function setSourceAddressesFor(key, addressList){
  for (let address of sourceState.keys()) {
    if (address[0]==key && !addressList.has(address)) {
      console.debug("deleting", address[0], "for", key, "giving", sourceState);
      sourceState.delete(address)
    }
  }
  let extantAddresses = new Set(sourceState.keys());
  for (let address of addressList) {

    if (!extantAddresses.has(address)) {
      sourceState.set(address, 0.0);
      console.debug("adding", address, "for", key, "giving", sourceState);
    }
  }
  sourceStateSubject.onNext(sourceState);
}
function setSinkAddressesFor(key, addressList){
  for (let address of sinkState.keys()) {
    if (address[0]==key && !addressList.has(address)) {
      sinkState.delete(address)
    }
  }
  let extantAddresses = new Set(sinkState.keys());

  if (!extantAddresses.has(address)) {
    sinkState.set(address, 0.0);
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