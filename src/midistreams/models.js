'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var update = require('react-addons-update');
var intents = require('./intents');
var dataStreams = require('../datastreams/models');
var rawMidiSubscription;

//Basic midi state
var state = {
  midiinfo: null,
  allindevices: new Map(),
  alloutdevices: new Map(),
  activeindevice: null,
  activeoutdevice: null,
  incontrols: new Set(),
  outcontrols: new Set()

};
//midi model state
var stateStream = new Rx.BehaviorSubject(state);
//midi model updates
var updateStream = new Rx.Subject();

//utility
function handleMidiInMessage (ev) {
  //filters CC messages out of midi bytes and turns them into key+value
  //into ["midi",-3723423,1,16],-0.377
  //should this be some kind of transducer?
  //console.debug("hmm", ev);
  var midieventkey = ["midi", state.activeindevice, 0, 0];
  var midieventvalue;
  var cmd = ev.data[0] >> 4;
  var channel = ev.data[0] & 0x0f;
  var idx = ev.data[1];
  var val = (ev.data[2]-63.5)/63.5;
  //midievent[0] = cmd;
  midieventkey[2] = channel;
  midieventkey[3] = idx;
  midieventkey[3] = val;
  
  //11: CC
  //9: Note on
  //8: Note off
  if (cmd===11) {
    //console.debug("me", ev.data, midievent);
    dataStreams.dataStreamUpdateSubject.onNext({midieventkey:{$set: val }});
  }
};

function emitMidiOutMessage() {
  outdatastream.subscribe(function(data){
      var cmd = data[0];
      var channel = data[1];
      var idx = data[2];
      var val = Math.max(Math.min(
          Math.floor(data[3]*128),
          127), 0)
      //turns ["c",1,16,0.5]
      //into [177,16,64]
      var midibytes = [
          176 + channel,
          idx,
          val
      ];
      if (cmd==="c"){
          newoutdevice.send(midibytes);
      }
  });
}
//update state object through updateStream
updateStream.subscribe(function (upd) {
  var newState;
  newState = update(state, upd);
  //could use an immutable update cycle Here
  console.log("upd", upd, state, newState);
  state = newState;
  stateStream.onNext(state);
});

intents.subjects.selectMidiIn.subscribe(function(key){
  var tmp;
  updateStream.onNext({activeindevice:{$set:key}});
  if (rawMidiSubscription !== undefined) {
    rawMidiSubscription.dispose()
  };
  rawMidiSubscription = Rx.Observable.fromEvent(
    state.midiinfo.inputs.get(key), 'midimessage'
  ).subscribe(handleMidiInMessage);
});
//setup midi system
function initMidi() {
  Rx.Observable.fromPromise(
    global.navigator.requestMIDIAccess()
  ).subscribe(
    function(midiinfo) {
      //will the automatic midi updating work? untested.
      Rx.Observable.fromEvent(midiinfo, 'statechange').subscribe(
        () => updateMidiHardware(midiinfo)
      );
      updateMidiHardware(midiinfo);
    },
    (err) => console.debug(err.stack)
  );
};
function updateMidiHardware(midiinfo) {
  var allindevices = new Map();
  var alloutdevices = new Map();
  //turn the pseudo-Maps in the midiinfo dict into real maps
  for (var [key, val] of midiinfo.inputs.entries()){
    allindevices.set(key,val)
  };
  updateStream.onNext({
    midiinfo: {$set: midiinfo},
    allindevices: {$set: allindevices},
    alloutdevices: {$set: alloutdevices}
  });
};

initMidi();

module.exports = {
  stateStream: stateStream,
  updateStream: updateStream
};