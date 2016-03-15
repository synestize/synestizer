'use strict';

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');
var streamPatch = require('../streampatch/models');
var synthlib = require('./synthlib/main');
var activesynths = new Map();

//per-session object that shouldn't be in app state
var synthinfo = null;
var audioContext = null;
var inputNode = null;
var outputNode = null;

//Basic synth state
var state = {
  allindevices: new Map(),
  alloutdevices: new Map(),
  activeindevice: null,
  activeoutdevice: null,
  activeensembles: ["triad"],
  activecontrols: new Set([
    "synth-triad-something", 
    "synth-triad-somethingelse",
    "synth-triad-kittens",
    "synth-triad-mungbeans"])
};
//synth model state
var stateSubject = new Rx.BehaviorSubject(state);
//synth model updates
var updateSubject = new Rx.Subject();

function handleSynthSinkMessage ([address, val]) {
}

//We don't have infrastructure for this yet.
function registerSynth (synthName) {
  //register controls here.
}

//At this stage ,synths presumably don't change, so we just register controls once, here.
function publishSinks() {
  for (let address of state.activecontrols) {
    let stream = streamPatch.addSink(address);
    stream.subscribe((val) => (console.debug("synth control", address, val)));
  }
}
publishSinks();

//update UI state object through updateSubject
updateSubject.subscribe(function (upd) {
  var newState;
  newState = update(state, upd);
  //could use an immutable update cycle Here
  state = newState;
  stateSubject.onNext(state);
});

intents.subjects.selectSynthInDevice.subscribe(function(key){
  console.debug("synthin", key);
  updateSubject.onNext({activeindevice:{$set:key}});
});
intents.subjects.selectSynthOutDevice.subscribe(function(key){
  updateSubject.onNext({activeoutdevice:{$set:key}});
  publishSinks();
});

// raw synthesis interaction:
function setMasterGain(gain) {
  if (volumeGain){
    volumeGain.gain.value = gain;
  }
};
function setMasterTempo(gain) {
};
//Create a context with master out volume
function initContext(window){
  audioContext = new window.AudioContext();
  let compressor = audioContext.createDynamicsCompressor();
  compressor.threshold.value = -50;
  compressor.knee.value = 40;
  compressor.ratio.value = 2;
  compressor.reduction.value = 0; //should be negative for boosts?
  compressor.attack.value = 0.05;
  compressor.release.value = 0.3;
  compressor.connect(audioContext.destination);
  let volumeGain	= audioContext.createGain();
  volumeGain.connect(compressor);
  outputNode = volumeGain;
}(window);

module.exports = {
  stateSubject: stateSubject,
  updateSubject: updateSubject
};