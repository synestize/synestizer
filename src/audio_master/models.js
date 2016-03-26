'use strict';

var Rx = require('Rx');
var R = require('ramda');
var intents = require('./intents');
var streamPatch = require('../streampatch/models');
var transform = require('../lib/transform.js');

var _params = {
  "master-tempo": {
    label: "Master Tempo",
    transform: (val) => transform.bipolEquiOctave(40, 160, val),
  },
}

//canonical audio app state
var state = {
  mastergain: -12,
  params: {}
};
var stateSubject = new Rx.BehaviorSubject(state);
//volatile, unserializable, side effects
var volatileState = {
  audioinfo: null,
  audioContext: null,
  inputNode: null,
  outputNode: null,
};
//Create a context with master out volume
function initAudio(){
  let audioContext = volatileState.audioContext = new window.AudioContext();
  let compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -50;
  compressor.knee.value = 40;
  compressor.ratio.value = 2;
  compressor.reduction.value = 0; //should be negative for boosts?
  compressor.attack.value = 0.05;
  compressor.release.value = 0.3;
  compressor.connect(audioContext.destination);
  let volumeGain = volatileState.volumeGainNode = audioContext.createGain();
  volumeGain.connect(compressor);
  let outputNode = volatileState.outputNode = volumeGain;
};

// A param has a label, a median value, a transform and
// (derived) a current value and mapped value and 
// (volatile) a perturbation stream.
function decorateWithParams(state) {
  for (let address of state.params) {
    let subject = streamPatch.addSink(address);
    subject.subscribe((value) => setParamPerturbation(address, value));
  };
}
function getVolatileState() {
  return volatileState
}
//set up DSP and other controls
function init (){
  initAudio(state, window);
  decorateWithParams(state);
  stateSubject.onNext(state);
}

init();

// raw audio interaction:
// unlike the usual synth interactions this is in plain decibels.
function setMasterGain(gain) {
  state.mastergain = gain;
  stateSubject.onNext(state);
};
intents.subjects.setMasterGain.subscribe(setMasterGain);
stateSubject.pluck('mastergain').select((v)=>(v!==undefined)).subscribe(
  (gain) => (volatileState.volumeGainNode.gain.value = transform.dbAmp(gain))
);

//param audio interaction
function setMedian(address, value) {
  state.params[address].median=value;
  stateSubject.onNext(state);
};
intents.subjects.setMedian.subscribe(
  ([address, value]) => setMedian(address, value)
);

function setParamPerturbation(address, value) {
  state.params[address].median=value;  
  stateSubject.onNext(state);
}
intents.subjects.setParamPerturbation.subscribe(
  ([address, value]) => setParamPerturbation(address, value));

function transformedParamVal(address) {
  return _params[address].transform(currentParamVal(address))
}
function currentParamVal(address) {
  let param = params[address];
  return transform.perturb([param.median, param.perturbation], [1, 1])
}
function paramLabel(address){
  return _params[address].label
}
//return a dict of perturbed param objects for rendering?
function perturbedParamSet() {
 return {};
}

module.exports = {
  stateSubject: stateSubject,
  getVolatileState: getVolatileState,
  transformedParamVal: transformedParamVal,
  currentParamVal: currentParamVal,
  paramLabel: paramLabel,
  perturbedParamSet: perturbedParamSet,
};