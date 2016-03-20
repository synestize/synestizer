'use strict';

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');
var streamPatch = require('../streampatch/models');
var transform = require('../lib/transform.js');

//Basic audio state
var state = {
  allindevices: new Map(),
  alloutdevices: new Map(),
  activeindevice: null,
  activeoutdevice: null,
  activecontrols: new Set(),
  mastertempo: 120,
  mastergain: -12,
};
//audio model state
var stateSubject = new Rx.BehaviorSubject(state);
//audio model updates
var updateSubject = new Rx.Subject();

//per-session stuff that shouldn't be in app state
var volatileState = {
  audioinfo: null,
  audioContext: null,
  inputNode: null,
  outputNode: null,
};
var volatileStateSubject = new Rx.ReplaySubject(1);

//update state object through updateSubject
updateSubject.subscribe(function (upd) {
  var newState;
  newState = update(state, upd);
  //could use an immutable update cycle Here
  state = newState;
  stateSubject.onNext(state);
});



function selectSynthInDevice(key){
  console.debug("audioin", key);
  updateSubject.onNext({activeindevice:{$set:key}});
};
intents.subjects.selectSynthInDevice.subscribe(selectSynthInDevice);

function selectSynthOutDevice(key) {
  updateSubject.onNext({activeoutdevice:{$set:key}});
  publishSinks();
};
intents.subjects.selectSynthOutDevice.subscribe(selectSynthOutDevice);

// raw audio interaction:
function setMasterGain(gain) {
  if (volumeGain){
    volumeGain.gain.value = gain;
  }
  updateSubject.onNext({mastergain:{$set:gain}});
};
function setMasterTempo(tempo) {
  updateSubject.onNext({activeindevice:{$set:tempo}});
};
//Create a context with master out volume
function initContext(){
  let audioContext = volatileState.audioContext = new window.AudioContext();
  let compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -50;
  compressor.knee.value = 40;
  compressor.ratio.value = 2;
  compressor.reduction.value = 0; //should be negative for boosts?
  compressor.attack.value = 0.05;
  compressor.release.value = 0.3;
  compressor.connect(audioContext.destination);
  let volumeGain = volatileState.volumeGain = audioContext.createGain();
  volumeGain.connect(compressor);
  let outputNode = volatileState.outputNode = volumeGain;
};



//set up DSP and other controls
function init (){
  initContext(window);
  //What does this guy need?
  //A notion of central value
  //A notion of current value
  //Optional: notion of unmapped value
  
  let subject = streamPatch.addSink("audio-tempo");
  subject.subscribe((val)=>setMasterTempo(transform.bipolEquiOctave(30,480,val)));
  volatileStateSubject.onNext(volatileState);
}

init();

module.exports = {
  stateSubject: stateSubject,
  updateSubject: updateSubject,
  volatileStateSubject: volatileStateSubject,
};