'use strict';

var Rx = require('Rx');
var R = require('ramda');
var intents = require('./intents');
var streamPatch = require('../streampatch/models');
var transform = require('../lib/transform.js');

//canonical audio app state
var state = {
  masterGain: -12,
  medianMasterTempo: 0,
  perturbationMasterTempo: 0,
  actualMasterTempo: 0,
  //volatile, unserializable, side effects
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
  let outputNode = state._audio.outputNode = context.createGain();
  outputNode.connect(compressor);
  return state
};

//set up DSP and other controls
function init (){
  state=initAudio(state, window);
  streamPatch.addSink("master-tempo").subscribe(
    (value) => setPerturbationMasterTempo(value));
  stateSubject.onNext(state);
}
init();

// raw audio interaction:
// unlike the usual synth interactions this is in plain decibels.
function setMasterGain(gain) {
  state.masterGain = gain;
  stateSubject.onNext(state);
};
intents.subjects.setMasterGain.subscribe(setMasterGain);
stateSubject.pluck('masterGain').subscribe(
  (gain) => (state._audio.outputNode.gain.value = transform.dbAmp(gain))
);

//param audio interaction
function setMedianMasterTempo(value) {
  state.medianMasterTempo = value;
  stateSubject.onNext(state);
};
intents.subjects.setMedianMasterTempo.subscribe(
  (value) => setMedianMasterTempo(value)
);

function setPerturbationMasterTempo(value) {
  state.perturbationMasterTempo=value;  
  stateSubject.onNext(state);
}
stateSubject.subscribe(function(state){
  let actualMasterTempo = transform.perturb([
    state.medianMasterTempo, state.perturbationMasterTempo
  ]);
  //Do something with actualMasterTempo value
});

module.exports = {
  stateSubject: stateSubject,
};