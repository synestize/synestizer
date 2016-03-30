'use strict';

var Rx = require('Rx');
var R = require('ramda');
var intents = require('./intents');
var streamPatch = require('../streampatch/models');
var transform = require('../lib/transform.js');

//canonical audio app state
var state = {
  mastergain: -12,
  params:  {
    "master-tempo": {
      label: "Master Tempo",
      transform: (val) => transform.bipolEquiOctave(40, 160, val),
    },
  },
  //volatile, unserializable, side effects"
  _audio: {
    audioinfo: null,
    context: null,
    inputNode: null,
    outputNode: null,
 }
};
var stateSubject = new Rx.BehaviorSubject(state);
//Create a context with master out volume
function initAudio(){
  let context = state._audio.context = new window.AudioContext();
  let compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -50;
  compressor.knee.value = 40;
  compressor.ratio.value = 2;
  compressor.reduction.value = 0; //should be negative for boosts?
  compressor.attack.value = 0.05;
  compressor.release.value = 0.3;
  compressor.connect(context.destination);
  let volumeGainNode = state._volumeGainNode = context.createGain();
  volumeGainNode.connect(compressor);
  let outputNode = state._audio.outputNode = volumeGainNode;
  return state
};

//set up DSP and other controls
function init (){
  state=initAudio(state, window);
  // A param has a label, a median value, a transform and
  // (derived) a current value and mapped value and 
  // (volatile) a perturbation stream.
  streamPatch.addSink("master-tempo").subscribe(
    (value) => setParamPerturbation("master-tempo", value));;
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
  (gain) => (state._audio.volumeGainNode.gain.value = transform.dbAmp(gain))
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
  return state.params[address].transform(currentParamVal(address))
}
function currentParamVal(address) {
  let param = params[address];
  return transform.perturb([param.median, param.perturbation], [1, 1])
}

module.exports = {
  stateSubject: stateSubject,
  transformedParamVal: transformedParamVal,
  currentParamVal: currentParamVal,
};