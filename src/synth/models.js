'use strict';

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');
var streamPatch = require('../streampatch/models');
var ensembles = require('./ensembles/main');
//contains volatile ensemble data
var activeEnsembleMap = new Map();

//Basic synth state
var state = {
  allindevices: new Map(),
  alloutdevices: new Map(),
  activeindevice: null,
  activeoutdevice: null,
  activeensemblekeys: [],
  activecontrols: new Set(),
  mastertempo: 120,
  mastergain: -12,
};
//synth model state
var stateSubject = new Rx.BehaviorSubject(state);
//synth model updates
var updateSubject = new Rx.Subject();

//per-session stuff that shouldn't be in app state
var volatileState = {
  synthinfo: null,
  audioContext: null,
  inputNode: null,
  outputNode: null,
};

//We don't have infrastructure for this yet.
/*
function registerSynth (synthName) {
  //register controls here.
}
*/

//update state object through updateSubject
updateSubject.subscribe(function (upd) {
  var newState;
  newState = update(state, upd);
  //could use an immutable update cycle Here
  state = newState;
  stateSubject.onNext(state);
});



function selectSynthInDevice(key){
  console.debug("synthin", key);
  updateSubject.onNext({activeindevice:{$set:key}});
};
intents.subjects.selectSynthInDevice.subscribe(selectSynthInDevice);

function selectSynthOutDevice(key) {
  updateSubject.onNext({activeoutdevice:{$set:key}});
  publishSinks();
};
intents.subjects.selectSynthOutDevice.subscribe(selectSynthOutDevice);

// raw synthesis interaction:
function setMasterGain(gain) {
  if (volumeGain){
    volumeGain.gain.value = gain;
  }
  updateSubject.onNext({mastergain:{$set:key}});
};
function setMasterTempo(tempo) {
  updateSubject.onNext({activeindevice:{$set:key}});
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
  let volumeGain = volatilestate.volumeGain = audioContext.createGain();
  volumeGain.connect(compressor);
  let outputNode = volatilestate.outputNode = volumeGain;
};

//set up DSP and other controls
function init (){
  initContext(window);
  let subject = streamPatch.addSink("synth-tempo");
  subject.subscribe((val)=>setMasterTempo(bipolEquiOctave(30,480,val)));
  
  for (let ensembleKey of ensembles) {
    console.debug("ensembleKey", ensembleKey);
    let ensemble = ensembles[ensembleKey];
    state.activeensemblekeys.push('ensembleKey');
    activeEnsembles.set(
      ensembleKey,
      ensemble(
        ensembleKey,
        stateStream,
        volatileState
      )
    );
  }
}

init();

module.exports = {
  stateSubject: stateSubject,
  updateSubject: updateSubject,
  activeEnsembles: activeEnsembles,
  volatileState: volatileState,
};