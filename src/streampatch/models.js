'use strict';
// A supply of control data streams
// for other models to actually supply or use

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');
var setop = require('../lib/setop.js');

/*
internal state handles high-speed source updates and slower sink updates
*/
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
// we really don't want to have datastreams re-render the DOM after every update
var state =  {
  sourceState: sourceState,
  sinkState: sinkState,
  sourceFirehoses: sourceFirehoses, //streams of source values
  sinkFirehoses: sinkFirehoses, //streams of sink values
  sourceSinkMappingMag: sourceSinkMappingMag,
  sourceSinkMappingSign: sourceSinkMappingSign,
};

//UI-rate state
var stateSubject = new Rx.BehaviorSubject(state);
var updateSubject = new Rx.Subject();
//update UI state object through updateSubject
updateSubject.subscribe(function (upd) {
  var newState;
  newState = update(state, upd);
  state = newState;
  stateSubject.onNext(state);
});

sourceStateSubject.throttle(20).subscribe(function(sourceState) {
  sinkState = calcSinkValues(sourceState);
  updateSubject.onNext({
    sourceState: {$set: sourceState},
    sinkState: {$set: sinkState}
  });
});

function addSourceAddress(address){
  sourceFirehoses.set(
    address,
    sourceFirehoses.get(address) || new Rx.BehaviorSubject(0.0)
  );
  let subject = sourceFirehoses.get(address);
  updateSubject.onNext({sourceFirehoses: {$set: sourceFirehoses}})
  subject.subscribe(
    function ([key, val]) {
      sourceState.set(key, val);
      window.sourceState = sourceState;
      sourceStateSubject.onNext(sourceState);
    }
  );
  return subject;
}
function removeSourceAddress(address) {
  sourceFirehoses.delete(address);
  //more?
  for (let key of [...sourceSinkMappingSign.keys()]) {
    let [sourceAddress, sinkAddress] = key.split("/");
    if (!sourceFirehoses.has(sourceAddress)) {
      sourceSinkMappingSign.delete(key);
    }
  }
  for (let key of [...sourceSinkMappingMag.keys()]) {
    let [sourceAddress, sinkAddress] = key.split("/");
    if (!sourceFirehoses.has(sourceAddress)) {
      sourceSinkMappingMag.delete(key);
    }
  }
}
function addSinkAddress(address) {
  sinkFirehoses.set(
    address,
    sinkFirehoses.get(address) || new Rx.BehaviorSubject(0.0)
  );
  let subject = sinkFirehoses.get(address);
  updateSubject.onNext({sinkFirehoses: {$set: sinkFirehoses}})
  return subject;
}
function removeSinkAddress(address) {
  sinkFirehoses.delete(address);
  for (let key of [...sourceSinkMappingSign.keys()]) {
    let [sourceAddress, sinkAddress] = key.split("/");
    if (!sinkFirehoses.has(sinkAddress)) {
      sourceSinkMappingSign.delete(key);
    }
  }
  for (let key of [...sourceSinkMappingMag.keys()]) {
    let [sourceAddress, sinkAddress] = key.split("/");
    if (!sinkFirehoses.has(sinkAddress)) {
      sourceSinkMappingMag.delete(key);
    }
  }
}
function setMappingSign(sourceAddress, sinkAddress, value) {
  //Careful. it's messy here because update helpers don't work with Maps, and so our mutation semantics are all fucked up.
  // console.debug("sssms", sourceAddress, sinkAddress, value);
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
  // console.debug("sssmm", sourceAddress, sinkAddress, value);
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
  //Calculates the mapping from the polarity and magnitude dictionaries
  sourceSinkMapping = new Map();
  for (let [key, scale] of sourceSinkMappingMag.entries()) {
    sourceSinkMapping.set(key, scale * (sourceSinkMappingSign.get(key) || 1.0));
  };
};

function calcSinkValues(sourceState) {
  var newSinkStateT = new Map(); // temporary tanh-transformed sink vals
  var newSinkState = new Map(); // replacement sink vals
  for (let sinkAddress of sinkState.keys()) {
    newSinkStateT.set(sinkAddress, 0.0);
  };
  
  // console.debug("ss", sourceState);
  // console.debug("ss1", sourceSinkMapping);
  
  for (let [key, scale] of sourceSinkMapping.entries()) {
    let [sourceAddress, sinkAddress] = key.split("/");
    let sourceVal = sourceState.get(sourceAddress) || 0.0;
    let sinkValT = newSinkStateT.get(sinkAddress) || 0.0;
    newSinkStateT.set(sinkAddress,
      sinkValT + scale * Math.tanh(sourceVal)
    );
    // console.debug("ssq", sourceAddress, sinkAddress, sourceVal, sinkValT, newSinkStateT.get(sinkAddress));
  };
  for (let [sinkAddress, sinkValT] of newSinkStateT.entries()) {
    let sinkKey = sinkAddress.split("-")[0]
    let sinkVal = Math.atanh(sinkValT);
    let lastSinkVal = sinkState.get(sinkAddress);
    // console.debug("ssr", sinkAddress, sinkValT, sinkVal, lastSinkVal);
    newSinkState.set(sinkAddress, sinkVal);
    //This could be done more elegantly by filtering the stream
    if (lastSinkVal !== sinkVal) {
      // console.debug("ssru", sinkAddress, sinkVal);
      sinkFirehoses.get(sinkKey).onNext([sinkAddress, sinkVal]);
    }
  };
  return newSinkState;
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
  addSourceAddress: addSourceAddress,
  removeSourceAddress: removeSourceAddress,
  addSinkAddress: addSinkAddress,
  removeSinkAddress: removeSourceAddress,
  setMappingSign: setMappingSign,
  setMappingMag: setMappingMag,
  stateSubject: stateSubject,
  updateSubject: updateSubject
};