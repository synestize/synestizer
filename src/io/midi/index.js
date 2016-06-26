'use strict';

import Rx from 'rx'
import  { setValidMidiSource, setCurrentMidiSource, setAllMidiSources } from '../../actions'
import { toObservable } from '../../lib/rx_redux'
// var streamPatch = require('../streampatch/models');
var transform = require('../../lib/transform.js');
var setop = require('../../lib/setop.js');

var rawMidiInSubscription;

//this is a per-session object and shouldn't be in app state
var midiinfo= null;

//Basic midi state
var state = {
  allsources: new Map(),
  allsinks: new Map(),
  activesource: null,
  activesink: null,
  activeinchannel: 1,
  activeoutchannel: 2,
  activeinccs: new Set([]),
  activeoutccs: new Set([]),
  solocc: null,
};
// model state
var stateSubject = new Rx.BehaviorSubject(state);
// model updates
var updateSubject = new Rx.Subject();

var midiSourceFirehose = new Rx.Subject();

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

  //midi commands
  //11: CC
  //9: Note on
  //8: Note off
  if ((cmd===11) &&
    (state.activeinchannel == channel) &&
    state.activeinccs.has(cc)) {
    //console.debug("me", ev.data, midievent);
    streamPatch.getSourceStream("midi-cc-"+ cc).onNext(val);
  };
};
//Interface to MIDI output
function handleMidiOutMessage(cc, scaled) {
  let unmuted = ((state.solocc === null) || (state.solocc===cc)) &&
    (midiinfo.outputs.get(state.activesink) !== undefined);
  //turns [["midi",16,0.5]
  //into [177,16,64]
  let midibytes = [
    176 + state.activeoutchannel,
    cc,
    scaled
  ];
  if (unmuted) {
    midiinfo.outputs.get(state.activesink).send(midibytes);
  };
};

//update UI state object through updateSubject
updateSubject.subscribe(function (upd) {
  var newState;
  newState = update(state, upd);
  //could use an immutable update cycle Here
  state = newState;
  stateSubject.onNext(state);
});

function selectMidiSource(key) {
  console.debug("midiin", key);
  updateSubject.onNext({activesource:{$set:key}});
  if (midiinfo !==null) {
    if (rawMidiInSubscription !== undefined) {
      rawMidiInSubscription.dispose()
    };
    rawMidiInSubscription = Rx.Observable.fromEvent(
      midiinfo.inputs.get(key), 'midimessage'
    ).subscribe(handleMidiInMessage);
  }
}
intents.subjects.selectMidiSource.subscribe(selectMidiSource);

function selectMidiInChannel(i) {
  updateSubject.onNext({activeinchannel:{$set:i}});
}
intents.subjects.selectMidiInChannel.subscribe(selectMidiInChannel);

function addMidiInCC(cc) {
  state.activeinccs.add(cc);
  let address = "midi-cc-"+ cc;
  streamPatch.addSource(address);
  updateSubject.onNext(
    {activeinccs:{$set: state.activeinccs}}
  );
}
intents.subjects.addMidiInCC.subscribe(addMidiInCC);

function removeMidiInCC(cc) {
  let newccs = state.activeinccs;
  newccs.delete(cc);
  let address = "midi-cc-"+ cc;
  streamPatch.removeSource(address);
  updateSubject.onNext({activeinccs:{$set:newccs}});
}
intents.subjects.removeMidiInCC.subscribe(removeMidiInCC);

function setMidiInCC (a) {
  let newccs = new Set(a);
  let oldccs = new Set(state.activeinccs);
  //delete unused
  for (let cc of setop.difference(oldccs, newccs)) {
    removeMidiInCC(cc);
  };
  for (let cc of setop.difference(newccs, oldccs)) {
    addMidiInCC(cc);
  }
}
intents.subjects.setMidiInCC.subscribe(setMidiInCC);

function selectMidiSink(key) {
  updateSubject.onNext({activesink:{$set:key}});
}
intents.subjects.selectMidiSink.subscribe(selectMidiSink);

function selectMidiOutChannel(i) {
  updateSubject.onNext({activeoutchannel:{$set:i}});
}
intents.subjects.selectMidiOutChannel.subscribe(selectMidiOutChannel);

function addMidiOutCC(cc) {
  state.activeoutccs.add(cc);
  let address = "midi-cc-"+ cc;
  let subject = streamPatch.addSink(address);
  subject.map(transform.bipolMidi).distinctUntilChanged().subscribe(
    (val) => handleMidiOutMessage(cc, val)
  );
  updateSubject.onNext(
    {activeoutccs:{$set: state.activeoutccs}}
  );
}
intents.subjects.addMidiOutCC.subscribe(addMidiOutCC);

function removeMidiOutCC(cc) {
  let newccs = state.activeoutccs;
  newccs.delete(cc);
  let address = "midi-cc-"+ cc;
  streamPatch.removeSink(address);
  updateSubject.onNext({activeoutccs:{$set:newccs}});
}
intents.subjects.removeMidiOutCC.subscribe(removeMidiOutCC);

function setMidiOutCC(a) {
  let newccs = new Set(a);
  let oldccs = new Set(state.activeoutccs);
  console.debug("setMidiOutCC", a, newccs, oldccs, setop.difference(oldccs, newccs), setop.difference(newccs, oldccs));
  //delete unused
  for (let cc of setop.difference(oldccs, newccs)) {
    removeMidiOutCC(cc);
  };
  for (let cc of setop.difference(newccs, oldccs)) {
    addMidiOutCC(cc);
  }
}
intents.subjects.setMidiOutCC.subscribe(setMidiOutCC);

function soloCC(cc) {
  console.debug("soloCC", cc);
  updateSubject.onNext({solocc:{$set: cc}});
}
intents.subjects.soloCC.subscribe(soloCC);

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
  var allsources = new Map();
  var allsinks = new Map();
  midiinfo = newmidiinfo;
  //turn the pseudo-Maps in the midiinfo dict into real maps
  for (var [key, val] of midiinfo.inputs.entries()){
    allsources.set(key, val.name)
  };
  for (var [key, val] of midiinfo.outputs.entries()){
    allsinks.set(key, val.name)
  };
  updateSubject.onNext({
    allsources: {$set: allsources},
    allsinks: {$set: allsinks}
  });
};

module.exports = {
  init: init,
  stateSubject: stateSubject,
  updateSubject: updateSubject
};
