'use strict';
// A supply of control data streams
// for other models to actually supply or use

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');
var setop = require('../lib/setop.js');
var transform = require('../lib/transform.js');

/*
internal state handles high-speed source updates and slower sink updates
*/
var sourceFirehoseMap = new Map();
var sinkFirehoseMap = new Map();
var sourceSinkMappingMag = new Map();
var sourceSinkMappingSign = new Map();
var sourceSinkMapping = new Map();

//metadata of individual controls
var sourceMap = new Map();
var sinkMap = new Map();
//values of individual controls
var sourceState = window.streamPatchState = new Map();
var sourceStateSubject = new Rx.BehaviorSubject(sourceState);
var sinkState = window.sinkPatchState = new Map();
var sinkStateSubject = new Rx.BehaviorSubject(sinkState);

// UI state; control vals are throttled
// We treat these differently than raw data flows
// we really don't want to have datastreams re-render the DOM after every update
var state =  {
  sourceMap: sourceMap,
  sinkMap: sinkMap,
  sourceState: sourceState,
  sinkState: sinkState,
  sourceFirehoseMap: sourceFirehoseMap, //streams of source values
  sinkFirehoseMap: sinkFirehoseMap, //streams of sink values
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
  //console.debug("sss", sourceState);
  sinkState = calcSinkValues(sourceState);
  sinkStateSubject.onNext(sinkState);
  updateSubject.onNext({
    sourceState: {$set: sourceState},
    sinkState: {$set: sinkState}
  });
});

function addSource(address, label){
  sourceMap.set(address, label);
  sourceState.set(address, 0.0);
  let subject = sourceFirehoseMap.get(address);
  if (subject === undefined) {
    subject = new Rx.BehaviorSubject(0.0);
    sourceFirehoseMap.set(address, subject);
    subject.subscribe(function (val) {
      //console.debug("up", address);
      sourceState.set(address, val);
      sourceStateSubject.onNext(sourceState);
    });
  }
  updateSubject.onNext({
    sourceState: {$set: sourceState},
    sourceMap: {$set: sourceMap},
    sourceFirehoseMap: {$set: sourceFirehoseMap},
  })
  return subject;
}
function removeSource(address) {
  sinkMap.delete(address);
  let subject = sourceFirehoseMap.get(address);
  sourceFirehoseMap.delete(address);
  subject.onCompleted();
  sinkState.delete(address);
  //more?
  for (let key of [...sourceSinkMappingSign.keys()]) {
    let [sourceAddress, sinkAddress] = key.split("/");
    if (!sourceFirehoseMap.has(sourceAddress)) {
      sourceSinkMappingSign.delete(key);
    }
  }
  for (let key of [...sourceSinkMappingMag.keys()]) {
    let [sourceAddress, sinkAddress] = key.split("/");
    if (!sourceFirehoseMap.has(sourceAddress)) {
      sourceSinkMappingMag.delete(key);
    }
  }
  updateSubject.onNext({
    sourceState: {$set: sourceState},
    sourceMap: {$set: sourceMap},
    sourceFirehoseMap: {$set: sourceFirehoseMap},
  })
}
function getSourceStream(address){
  return sourceFirehoseMap.get(address);
}
function addSink(address, label){
  sinkMap.set(address, label);
  sinkState.set(address, 0.0);
  let subject = sinkFirehoseMap.get(address);
  if (subject === undefined) {
    subject = new Rx.BehaviorSubject(0.0);
    sinkFirehoseMap.set(address, subject);
    subject.subscribe(function (val) {
      //console.debug("up", address);
      sinkState.set(address, val);
      sinkStateSubject.onNext(sinkState);
    });
  }
  updateSubject.onNext({
    sinkState: {$set: sinkState},
    sinkMap: {$set: sinkMap},
    sinkFirehoseMap: {$set: sinkFirehoseMap},
  })
  return subject;
}
function removeSink(address) {
  sinkMap.delete(address);
  let subject = sinkFirehoseMap.get(address);
  subject.onCompleted();
  sinkFirehoseMap.delete(address);
  sinkState.delete(address);
  for (let key of [...sourceSinkMappingSign.keys()]) {
    let [sourceAddress, sinkAddress] = key.split("/");
    if (!sinkFirehoseMap.has(sinkAddress)) {
      sourceSinkMappingSign.delete(key);
    }
  }
  for (let key of [...sourceSinkMappingMag.keys()]) {
    let [sourceAddress, sinkAddress] = key.split("/");
    if (!sinkFirehoseMap.has(sinkAddress)) {
      sourceSinkMappingMag.delete(key);
    }
  }
  updateSubject.onNext({
    sinkState: {$set: sinkState},
    sinkMap: {$set: sinkMap},
    sinkFirehoseMap: {$set: sinkFirehoseMap},
  })
}
function getSinkStream(address){
  return sinkFirehoseMap.get(address);
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
  let newSinkStateT = new Map(); // temporary tanh-transformed sink vals
  let newSinkState = new Map(); // replacement sink vals  
  // console.debug("ss", sourceState);
  // console.debug("ss1", sourceSinkMapping);
  
  for (let [key, scale] of sourceSinkMapping.entries()) {
    let [sourceAddress, sinkAddress] = key.split("/");
    let sourceVal = sourceState.get(sourceAddress) || 0.0;
    let delta = scale * transform.desaturate(sourceVal);
    if (delta!==0.0) {
      newSinkStateT.set(sinkAddress,
        delta + (newSinkStateT.get(sinkAddress) || 0.0)
      );
    };
  };
  for (let [sinkAddress, sinkValT] of newSinkStateT.entries()) {
    let sinkVal = transform.saturate(sinkValT);
    let lastSinkVal = sinkState.get(sinkAddress);
    newSinkState.set(sinkAddress, sinkVal);
    //This could be done more elegantly by filtering the stream
    if (lastSinkVal !== sinkVal) {
      // console.debug("ssru", sinkAddress, sinkVal);
      sinkFirehoseMap.get(sinkAddress).onNext(sinkVal);
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
  sourceFirehoseMap: sourceFirehoseMap,
  sinkStateSubject: sinkStateSubject,
  sinkFirehoseMap: sinkFirehoseMap,
  addSource: addSource,
  removeSource: removeSource,
  getSourceStream: getSourceStream,
  addSink: addSink,
  removeSink: removeSink,
  getSinkStream: getSinkStream,
  setMappingSign: setMappingSign,
  setMappingMag: setMappingMag,
  stateSubject: stateSubject,
  updateSubject: updateSubject
};