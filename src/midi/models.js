'use strict';

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');
var streamPatch = require('../streampatch/models');
var transform = require('../lib/transform.js');

var rawMidiInSubscription;

//this is a per-session object and shouldn't be in app state
var midiinfo= null;

//Basic midi state
var state = {
  allindevices: new Map(),
  alloutdevices: new Map(),
  activeindevice: null,
  activeoutdevice: null,
  activeinchannel: 1,
  activeoutchannel: 2,
  activeinccs: new Set([1,2,3]),
  activeoutccs: new Set([4,5,6])
};
//midi model state
var stateSubject = new Rx.BehaviorSubject(state);
//midi model updates
var updateSubject = new Rx.Subject();

var midiSourceFirehose = new Rx.Subject();

function publishSources() {
  let addresses = new Set();
  if (midiinfo !==null) {
    for (let cc of state.activeinccs) {
      addresses.add("midi-cc-"+ cc);
    };
  };
  streamPatch.setSourceAddressesFor("midi", addresses);
}
function publishSinks() {
  let addresses = new Set();
  if (midiinfo !==null) {
    for (let cc of state.activeoutccs) {
      addresses.add("midi-cc-"+ cc);
    };
  };
  streamPatch.setSinkAddressesFor("midi", addresses);
}

// Interface to MIDI input
function handleMidiInMessage (ev) {
  //filters CC messages out of midi bytes and turns them into key+value
  //into ["midi",-3723423,1,16],-0.377
  //should this be some kind of transducer?
  //console.debug("hmm", ev);
  var cmd = ev.data[0] >> 4;
  var channel = ev.data[0] & 0x0f;
  var cc = ev.data[1];
  var val = transform.midiBipol(ev.data[2]);
  //midievent[0] = cmd;
  var midiaddress = ("midi-cc-"+ cc);

  //midi commands
  //11: CC
  //9: Note on
  //8: Note off
  if ((cmd===11) &&
    (state.activeinchannel == channel) &&
    state.activeinccs.has(cc)) {
    //console.debug("me", ev.data, midievent);
    midiSourceFirehose.onNext([midiaddress, val]);
  };
};
//Interface to MIDI output
function handleMidiSinkMessage([address, val]) {
  console.debug(address, val);
  
  //we should only receive "midi" keyed messages
  let [type, cmd, cc] = address.split("-");
  let scaled = transform.bipolMidi(val);
  //turns [["midi",16,0.5]
  //into [177,16,64]
  let midibytes = [
    176 + state.activeoutchannel,
    cc,
    scaled
  ];
  midiinfo.outputs.get(state.activeoutdevice).send(midibytes);
};

//update UI state object through updateSubject
updateSubject.subscribe(function (upd) {
  var newState;
  newState = update(state, upd);
  //could use an immutable update cycle Here
  state = newState;
  stateSubject.onNext(state);
});

function selectMidiInDevice(key) {
  console.debug("midiin", key);
  updateSubject.onNext({activeindevice:{$set:key}});
  if (midiinfo !==null) {
    if (rawMidiInSubscription !== undefined) {
      rawMidiInSubscription.dispose()
    };
    rawMidiInSubscription = Rx.Observable.fromEvent(
      midiinfo.inputs.get(key), 'midimessage'
    ).subscribe(handleMidiInMessage);
  }
}
intents.subjects.selectMidiInDevice.subscribe(selectMidiInDevice);
function selectMidiInChannel(i) {
  updateSubject.onNext({activeinchannel:{$set:i}});
}
intents.subjects.selectMidiInChannel.subscribe(selectMidiInChannel);
function addMidiInCC(cc) {
  state.activeinccs.add(cc);
  let address = "midi-cc-"+ cc;
  inputStreams.set(address, streamPatch.addSourceAddress(address));
  updateSubject.onNext(
    {activeinccs:{$set: state.activeinccs}}
  );
}
intents.subjects.addMidiInCC.subscribe(addMidiInCC);

function removeMidiInCC(cc) {
  let newccs = state.activeinccs;
  newccs.delete(i);
  let address = "midi-cc-"+ cc;
  streamPatch.removeSourceAddress(address);
  updateSubject.onNext({activeinccs:{$set:newccs}});
}
intents.subjects.removeMidiInCC.subscribe(removeMidiInCC);

function setMidiInCC (a) {
  let newccs = new Set(a);
  let oldccs = new Set(state.activeinccs);
  //delete unused
  for (let cc of setop.difference(oldccs, newccs)) {
  }
  let toRemove = setop.difference(oldccs, newccs);
  let toAdd = setop.difference(newccs, oldccs);
  updateSubject.onNext({activeinccs:{$set:newccs}});
}
intents.subjects.setMidiInCC.subscribe(setMidiInCC);

function selectMidiOutDevice(key) {
  updateSubject.onNext({activeoutdevice:{$set:key}});
}
intents.subjects.selectMidiOutDevice.subscribe(selectMidiOutDevice);

function selectMidiOutChannel(i) {
  updateSubject.onNext({activeoutchannel:{$set:i}});
}
intents.subjects.selectMidiOutChannel.subscribe(selectMidiOutChannel);

function addMidiOutCC(i) {
  state.activeoutccs.add(i);
  updateSubject.onNext(
    {activeoutccs:{$set: state.activeoutccs.add(i)}}
  );
}
intents.subjects.addMidiOutCC.subscribe(addMidiOutCC);

function removeMidiOutCC(i) {
  var newccs = state.activeoutccs;
  newccs.delete(i);
  updateSubject.onNext({activeoutccs:{$set:newccs}});
}
intents.subjects.removeMidiOutCC.subscribe(removeMidiOutCC);

function setMidiOutCC(a) {
  var newccs = new Set(a);
  updateSubject.onNext({activeoutccs:{$set:newccs}});
}


//set up midi system
function init() {
  Rx.Observable.fromPromise(
    global.navigator.requestMIDIAccess()
  ).subscribe(
    function(newmidiinfo) {
      midiinfo = newmidiinfo;
      //will the automatic midi updating work? untested.
      Rx.Observable.fromEvent(midiinfo, 'statechange').subscribe(
        () => updateMidiIO(midiinfo)
      );
      updateMidiIO(midiinfo);
    },
    (err) => console.debug(err.stack)
  );
};
function updateMidiIO(newmidiinfo) {
  var allindevices = new Map();
  var alloutdevices = new Map();
  midiinfo = newmidiinfo;
  //turn the pseudo-Maps in the midiinfo dict into real maps
  for (var [key, val] of midiinfo.inputs.entries()){
    allindevices.set(key, val.name)
  };
  for (var [key, val] of midiinfo.outputs.entries()){
    alloutdevices.set(key, val.name)
  };
  updateSubject.onNext({
    allindevices: {$set: allindevices},
    alloutdevices: {$set: alloutdevices}
  });
};

streamPatch.registerSource("midi", midiSourceFirehose);
streamPatch.registerSink("midi", handleMidiSinkMessage);

publishSources();
publishSinks();

module.exports = {
  init: init,
  stateSubject: stateSubject,
  updateSubject: updateSubject
};