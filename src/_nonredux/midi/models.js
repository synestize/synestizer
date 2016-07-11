'use strict';

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');
var streamPatch = require('../streampatch/models');
var transform = require('../lib/transform.js');
var setop = require('../lib/setop.js');

var rawMidiInSubscription;

//this is a per-session object and shouldn't be in app state
var midiinfo= null;

//Basic midi state
var state = {
  allsources: new Map(),
  allsinks: new Map(),
  activesource: null,
  activesink: null,
  activesourcechannel: 1,
  activesinkchannel: 2,
  activesourceccs: new Set([]),
  activesinkccs: new Set([]),
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
    (state.activesourcechannel == channel) &&
    state.activesourceccs.has(cc)) {
    
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
    176 + state.activesinkchannel,
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

function selectMidiSourceChannel(i) {
  updateSubject.onNext({activesourcechannel:{$set:i}});
}
intents.subjects.selectMidiSourceChannel.subscribe(selectMidiSourceChannel);

function addMidiSourceCC(cc) {
  state.activesourceccs.add(cc);
  let address = "midi-cc-"+ cc;
  streamPatch.addSource(address);
  updateSubject.onNext(
    {activesourceccs:{$set: state.activesourceccs}}
  );
}
intents.subjects.addMidiSourceCC.subscribe(addMidiSourceCC);

function removeMidiSourceCC(cc) {
  let newccs = state.activesourceccs;
  newccs.delete(cc);
  let address = "midi-cc-"+ cc;
  streamPatch.removeSource(address);
  updateSubject.onNext({activesourceccs:{$set:newccs}});
}
intents.subjects.removeMidiSourceCC.subscribe(removeMidiSourceCC);

function setMidiSourceCC (a) {
  let newccs = new Set(a);
  let oldccs = new Set(state.activesourceccs);
  //delete unused
  for (let cc of setop.difference(oldccs, newccs)) {
    removeMidiSourceCC(cc);
  };
  for (let cc of setop.difference(newccs, oldccs)) {
    addMidiSourceCC(cc);
  }
}
intents.subjects.setMidiSourceCC.subscribe(setMidiSourceCC);

function selectMidiSink(key) {
  updateSubject.onNext({activesink:{$set:key}});
}
intents.subjects.selectMidiSink.subscribe(selectMidiSink);

function selectMidiSinkChannel(i) {
  updateSubject.onNext({activesinkchannel:{$set:i}});
}
intents.subjects.selectMidiSinkChannel.subscribe(selectMidiSinkChannel);

function addMidiSinkCC(cc) {
  state.activesinkccs.add(cc);
  let address = "midi-cc-"+ cc;
  let subject = streamPatch.addSink(address);
  subject.map(transform.bipolMidi).distinctUntilChanged().subscribe(
    (val) => handleMidiOutMessage(cc, val)
  );
  updateSubject.onNext(
    {activesinkccs:{$set: state.activesinkccs}}
  );
}
intents.subjects.addMidiSinkCC.subscribe(addMidiSinkCC);

function removeMidiSinkCC(cc) {
  let newccs = state.activesinkccs;
  newccs.delete(cc);
  let address = "midi-cc-"+ cc;
  streamPatch.removeSink(address);
  updateSubject.onNext({activesinkccs:{$set:newccs}});
}
intents.subjects.removeMidiSinkCC.subscribe(removeMidiSinkCC);

function setMidiSinkCC(a) {
  let newccs = new Set(a);
  let oldccs = new Set(state.activesinkccs);
  console.debug("setMidiSinkCC", a, newccs, oldccs, setop.difference(oldccs, newccs), setop.difference(newccs, oldccs));
  //delete unused
  for (let cc of setop.difference(oldccs, newccs)) {
    removeMidiSinkCC(cc);
  };
  for (let cc of setop.difference(newccs, oldccs)) {
    addMidiSinkCC(cc);
  }
}
intents.subjects.setMidiSinkCC.subscribe(setMidiSinkCC);

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
