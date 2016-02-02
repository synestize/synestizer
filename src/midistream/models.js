'use strict';

var Rx = require('Rx');
var React = require('react');
var update = require('react-addons-update');
var intents = require('./intents');
var dataStreams = require('../streampatches/models');
var rawMidiInSubscription;

//this is a per-session object and shouldn't be in app state
var midiinfo= null;

//Basic midi state
var state = {
  allindevices: new Map(),
  alloutdevices: new Map(),
  activeindevice: null,
  activeoutdevice: null,
  activeinchannel: null,
  activeoutchannel: null,
  activeinccs: new Set([1,2,3]),
  activeoutccs: new Set([4,5,6])
};
//midi model state
var stateStream = new Rx.BehaviorSubject(state);
//midi model updates
var updateStream = new Rx.Subject();

// Interface to MIDI input
function handleMidiInMessage (ev) {
  //filters CC messages out of midi bytes and turns them into key+value
  //into ["midi",-3723423,1,16],-0.377
  //should this be some kind of transducer?
  //console.debug("hmm", ev);
  var midieventkey = ["midi", state.activeindevice, 0, 0];
  var midieventvalue;
  var cmd = ev.data[0] >> 4;
  var channel = ev.data[0] & 0x0f;
  var cc = ev.data[1];
  var val = (ev.data[2]-63.5)/63.5;
  //midievent[0] = cmd;
  midieventkey[2] = channel;
  midieventkey[3] = cc;
  
  //midi commands
  //11: CC
  //9: Note on
  //8: Note off
  if ((cmd===11) &&
    (state.activeinchannel == channel) &&
    state.activeinccs.has(cc)) {
    //console.debug("me", ev.data, midievent);
    dataStreams.inputDataStreamChangeSubject.onNext({midieventkey:val });
  }
};
//Interface to MIDI output
dataStreams.outputDataStreamChangeSubject.filter(function([key, val]) {
  let [type, devicekey, channel, cc] = key;
  //we don't check for device at the moment; the wrong one should never arise
  if ((type=="midi") &&
      (channel==state.activeoutchannel) &&
      (state.activeoutccs.has(cc))) {
        return true;
  } else {return false}
}).subscribe(function([key, val]) {
    let [type, cmd, channel, cc] = key;
    let scaled = Math.max(Math.min(
      Math.floor(val*128),
      127), 0)
    //turns [["midi",-234121,1,16,0.5]
    //into [177,16,64]
    let midibytes = [
      176 + channel,
      cc,
      scaled
    ];
    midiinfo.outputs.get(state.activeoutdevice).send(midibytes);
});

//update state object through updateStream
updateStream.subscribe(function (upd) {
  var newState;
  newState = update(state, upd);
  //could use an immutable update cycle Here
  state = newState;
  stateStream.onNext(state);
});

intents.subjects.selectMidiInDevice.subscribe(function(key){
  var tmp;
  updateStream.onNext({activeindevice:{$set:key}});
  if (midiinfo !==null) {
    if (rawMidiInSubscription !== undefined) {
      rawMidiInSubscription.dispose()
    };
    rawMidiInSubscription = Rx.Observable.fromEvent(
      midiinfo.inputs.get(key), 'midimessage'
    ).subscribe(handleMidiInMessage);
  }
});
intents.subjects.selectMidiInChannel.subscribe(function(i){
  updateStream.onNext({activeinchannel:{$set:i}});
});
intents.subjects.addMidiInCC.subscribe(function(i){
  state.activeinccs.add(i);
  updateStream.onNext(
    {activeinccs:{$set: state.activeinccs.add(i)}}
  );
});
intents.subjects.removeMidiInCC.subscribe(function(i){
  var newccs = state.activeinccs;
  newccs.delete(i);
  updateStream.onNext({activeinccs:{$set:newccs}});
});
intents.subjects.swapMidiInCC.subscribe(function([i,j]){
  var newccs = state.activeinccs;
  newccs.delete(i);
  newccs.add(j);
  updateStream.onNext({activeinccs:{$set:newccs.add(j)}});
});

intents.subjects.selectMidiOutDevice.subscribe(function(key){
  var tmp;
  updateStream.onNext({activeoutdevice:{$set:key}});
  if (midiinfo !==null) {
    if (rawMidiOutSubscription !== undefined) {
      rawMidiInSubscription.dispose()
    };
    rawMidiInSubscription = Rx.Observable.fromEvent(
      midiinfo.outputs.get(key), 'midimessage'
    ).subscribe(handleMidiOutMessage);
  }
});
intents.subjects.selectMidiOutChannel.subscribe(function(i){
  updateStream.onNext({activeinchannel:{$set:i}});
});
intents.subjects.addMidiOutCC.subscribe(function(i){
  state.activeoutccs.add(i);
  updateStream.onNext(
    {activeoutccs:{$set: state.activeoutccs.add(i)}}
  );
});
intents.subjects.removeMidiOutCC.subscribe(function(i){
  var newccs = state.activeoutccs;
  newccs.delete(i);
  updateStream.onNext({activeoutccs:{$set:newccs}});
});
intents.subjects.swapMidiOutCC.subscribe(function([i,j]){
  var newccs = state.activeoutccs;
  newccs.delete(i);
  newccs.add(j);
  updateStream.onNext({activeoutccs:{$set:newccs.add(j)}});
});


//set up midi system
function initMidi() {
  Rx.Observable.fromPromise(
    global.navigator.requestMIDIAccess()
  ).subscribe(
    function(newmidiinfo) {
      midiinfo = newmidiinfo;
      //will the automatic midi updating work? untested.
      Rx.Observable.fromEvent(midiinfo, 'statechange').subscribe(
        () => updateMidiHardware(midiinfo)
      );
      updateMidiHardware(midiinfo);
    },
    (err) => console.debug(err.stack)
  );
};
function updateMidiHardware(newmidiinfo) {
  var allindevices = new Map();
  var alloutdevices = new Map();
  midiinfo = newmidiinfo;
  //turn the pseudo-Maps in the midiinfo dict into real maps
  for (var [key, val] of midiinfo.inputs.entries()){
    allindevices.set(key,val.name)
  };
  for (var [key, val] of midiinfo.outputs.entries()){
    alloutdevices.set(key,val.name)
  };
  updateStream.onNext({
    allindevices: {$set: allindevices},
    alloutdevices: {$set: alloutdevices}
  });
};

initMidi();

module.exports = {
  stateStream: stateStream,
  updateStream: updateStream
};