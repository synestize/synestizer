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
};
var stateSubject = new Rx.BehaviorSubject(state);
var _audioState =  {
    context: undefined,
    inputNode: undefined,
    outputNode: undefined,
};
var _audioStateSubject = new Rx.BehaviorSubject(_audioState);
  
//Create a context with master out volume
function initAudio(){
  let context = _audioState.context = new window.AudioContext();
  let compressor = context.createDynamicsCompressor();
  compressor.threshold.value = -50;
  compressor.knee.value = 40;
  compressor.ratio.value = 2;
  compressor.reduction.value = 0; //should be negative for boosts?
  compressor.attack.value = 0.05;
  compressor.release.value = 0.3;
  compressor.connect(context.destination);
  let outputNode = _audioStateSubject.outputNode = context.createGain();
  outputNode.connect(compressor);
  return _audioState
};

// raw audio interaction:
// unlike the usual synth interactions this is in plain decibels.
function setMasterGain(gain) {
  state.masterGain = gain;
  stateSubject.onNext(state);
};
intents.subjects.setMasterGain.subscribe(setMasterGain);

Rx.Observable.combineLatest(
  stateSubject.pluck('masterGain').distinctUntilChanged(),
  _audioStateSubject.pluck('outputNode').distinctUntilChanged()
).filter(
  (vals)=>Boolean(vals.reduce((a,b)=>(a && b))) //makes sure all values are truthy
).subscribe(
  ([gain, outputNode]) => (outputNode.gain.value = transform.dbAmp(gain))
);

//Master Tempo
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
};
Rx.Observable.combineLatest(
  stateSubject.pluck('medianMasterTempo').distinctUntilChanged(),
  stateSubject.pluck('perturbationMasterTempo').distinctUntilChanged()
).subscribe(function([a,b]) {
  state.actualMasterTempo = transform.perturb([a||0, b||0]);
  stateSubject.onNext(state);
});
//baseFreq
function setMedianBaseFreq(value) {
  state.medianBaseFreq = value;
  stateSubject.onNext(state);
};
console.debug("intents", intents);
intents.subjects.setMedianBaseFreq.subscribe(
  (value) => setMedianBaseFreq(value)
);
function setPerturbationBaseFreq(value) {
  state.perturbationBaseFreq=value;  
  stateSubject.onNext(state);
};
Rx.Observable.combineLatest(
  stateSubject.pluck('medianBaseFreq').distinctUntilChanged(),
  stateSubject.pluck('perturbationBaseFreq').distinctUntilChanged()
).subscribe(function([a,b]) {
  state.actualBaseFreq = transform.perturb([a||0, b||0]);
  stateSubject.onNext(state);
});

Rx.Observable.combineLatest(
  stateSubject.pluck('actualBaseFreq').distinctUntilChanged(),
  _audioStateSubject.pluck('outputNode').distinctUntilChanged()
).filter(
  (vals)=>Boolean(vals.reduce((a,b)=>(a && (b !== undefined))), true) //check  all values are defined
).subscribe(
  ([freq, outputNode]) => (outputNode.gain.value = transform.dbAmp(gain))
);


//set up DSP and other controls
function init (){
  _audioState = initAudio(state, window);
  streamPatch.addSink("master-tempo").subscribe(
    (value) => setPerturbationMasterTempo(value));
  streamPatch.addSink("base-freq").subscribe(
    (value) => setPerturbationBaseFreq(value));
}

module.exports = {
  init: init,
  stateSubject: stateSubject,
  _audioStateSubject: _audioStateSubject,
};