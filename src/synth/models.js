'use strict';

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');
var dataStreams = require('../streampatch/models');

//this is a per-session object and shouldn't be in app state
var synthinfo= null;

//Basic synth state
var state = {
  allindevices: new Map(),
  alloutdevices: new Map(),
  activeindevice: null,
  activeoutdevice: null,
};
//synth model state
var stateSubject = new Rx.BehaviorSubject(state);
//synth model updates
var updateSubject = new Rx.Subject();

var synthSinkFirehose = new Rx.Subject()


function publishSinks() {
  let addresses = new Set();
  //we have a valid MIDI in setup; announce the addresses
  for (let cc of state.activeoutccs) {
    addresses.add("synth-cc-"+ cc);
  }
  dataStreams.setSinkAddressesFor("synth", addresses);
}
//Interface to MIDI output
synthSinkFirehose.subscribe(function([address, val]) {

});

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
function updateSynthIO(newsynthinfo) {
  var allindevices = new Map();
  var alloutdevices = new Map();
  synthinfo = newsynthinfo;
  //turn the pseudo-Maps in the synthinfo dict into real maps
  for (var [key, val] of synthinfo.inputs.entries()){
    allindevices.set(key, val.name)
  };
  for (var [key, val] of synthinfo.outputs.entries()){
    alloutdevices.set(key, val.name)
  };
  updateSubject.onNext({
    allindevices: {$set: allindevices},
    alloutdevices: {$set: alloutdevices}
  });
};

dataStreams.registerSink("synth", synthSinkFirehose);

module.exports = {
  stateSubject: stateSubject,
  updateSubject: updateSubject
};