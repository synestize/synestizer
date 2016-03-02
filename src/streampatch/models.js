'use strict';
// A supply of control data streams
// for other models to actually supply or use

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');

// internal state is high speed
var sourceFirehoses = new Map();
var sinkFirehoses = new Map();
var sourceSinkMappingMag = new Map();
var sourceSinkMappingSign = new Map();
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
  sourceSinkMappingMag: sourceSinkMappingMag,
  sourceSinkMappingSign: sourceSinkMappingSign,
};

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
function setSourceAddressesFor(key, addressSet){
  // console.debug("ssaf", key, addressSet);
  for (let address of sourceState.keys()) {
    let thisKey = address.split("-")[0];
    if ((thisKey === key) && (!addressSet.has(address))) {
      // console.debug("ssafd", key, thisKey, address);
      sourceState.delete(address)
    }
  };
  let extantAddresses = new Set(sourceState.keys());
  for (let address of addressSet) {
    if (!extantAddresses.has(address)) {
      // console.debug("ssafa", key, address);
      sourceState.set(address, 0.0);
    }
  }
  sourceStateSubject.onNext(sourceState);
}
function setSinkAddressesFor(key, addressSet){
  // console.debug("Ssaf", key, addressSet);
  for (let address of sinkState.keys()) {
    let thisKey = address.split("-")[0];
    if ((thisKey===key) && (!addressSet.has(address))) {
      // console.debug("Ssafd", key, thisKey, address);
      sinkState.delete(address)
    }
  }
  let extantAddresses = new Set(sinkState.keys());
  for (let address of addressSet) {
    if (!extantAddresses.has(address)) {
      // console.debug("Ssafd", key, address);
      sinkState.set(address, 0.0);
    }
  }
  sinkStateSubject.onNext(sinkState);
}
function addSourceAddress(address){}
function removeSourceAddress(address){}
function addSinkAddress(address){}
function removeSinkAddress(address){}
function setMappingSign(sourceAddress, sinkAddress, value) {
  //Careful. it's messy here because update helpers don't work with Maps, and so our mutation semantics are all fucked up.
  console.debug("sssms", sourceAddress, sinkAddress, value);
  let key = sourceAddress + "/" + sinkAddress;
  let sourceSinkMappingSign = state.sourceSinkMappingSign;
  if (value>=0.0) {
    sourceSinkMappingSign.delete(key);
  } else {
    sourceSinkMappingSign.set(key, -1);
  };
  updateSubject.onNext({sourceSinkMappingSign: { $set: sourceSinkMappingSign}});
  updateMapping();
};

function setMappingMag(sourceAddress, sinkAddress, value) {
  //Careful. it's messy here because update helpers don't work with Maps, and so our mutation semantics are all fucked up.
  console.debug("sssmm", sourceAddress, sinkAddress, value);
  let key = sourceAddress + "/" + sinkAddress;
  let sourceSinkMapping = state.sourceSinkMapping;
  if (value===0.0) {
    sourceSinkMappingMag.delete(key);
  } else {
    sourceSinkMappingMag.set(key, value);
  };
  updateSubject.onNext({sourceSinkMappingMag: { $set: sourceSinkMappingMag}});
  updateMapping();
};

function updateMapping() {
  sourceSinkMapping = new Map();
  //cartesian product time? No, merge time.
};


intents.subjects.setMappingSign.subscribe(
  ([sourceAddress, sinkAddress, value]) => setMappingSign(sourceAddress, sinkAddress, value)
);
intents.subjects.setMappingMag.subscribe(
  ([sourceAddress, sinkAddress, value]) => setMappingMag(sourceAddress, sinkAddress, value)
);

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
  setMappingSign: setMappingSign,
  setMappingMag: setMappingMag,
  stateSubject: stateSubject,
  updateSubject: updateSubject
};