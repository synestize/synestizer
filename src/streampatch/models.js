'use strict';
//The simplest model; this is purely a global supply of data streams
//for other models to actually use
// We treat these differently than UI widget stuff; we really don't want to actually have our datasreams re-render the DOM after every update

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');

// State as far as UI is concerned
var sourceState = new Map();
window.sourceState = sourceState;
var sinkState = new Map();
window.sinkState = sinkState;

//should throttle these ones
var sourceStateSubject = new Rx.BehaviorSubject(sourceState);
var sinkStateSubject = new Rx.BehaviorSubject(sinkState);

// internal state is more high speed
var sourceFirehoses = new Map();
var sinkFirehoses = new Map();
var sourceSinkMapping = new Map();

function registerSource(key, observable){
  sourceFirehoses.set(key, observable);
  observable.subscribe(
    function ([key, val]) {
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
  setMapping: setMapping
};