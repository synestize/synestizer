'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var update = require('react-addons-update');

var state = {
  midiinfo: null,
  allindevices: new Map(),
  alloutdevices: new Map(),
  activeindevices: new Map(),
  activeoutdevices: new Map(),
  incontrols: new Set(),
  outcontrols: new Set()
};
var stateStream = new Rx.BehaviorSubject(state);
var updateStream = new Rx.Subject();
//setup midi system
function initMidi() {
  Rx.Observable.fromPromise(
    global.navigator.requestMIDIAccess()
  ).subscribe(
    function(midiinfo) {
      //will the automatic midi updating work? untested.
      Rx.Observable.fromEvent(midiinfo, 'statechange').subscribe(
        () => queryMidi(midiinfo)
      );
      queryMidi(midiinfo);
    },
    (err) => console.debug(err.stack)
  );
};
function queryMidi(midiinfo) {
  var allindevices = new Map();
  var alloutdevices = new Map();
  //turn the pseudo-Maps in the midiinfo dict into real maps
  midiinfo.inputs.forEach((val,key) => allindevices.set(key,val));
  midiinfo.outputs.forEach((val,key) => alloutdevices.set(key,val));
  updateStream.onNext({
    midiinfo: {$set: midiinfo},
    allindevices: {$set: allindevices},
    alloutdevices: {$set: alloutdevices}
  });
}
updateStream.subscribe(function (upd) {
  var newState;
  console.log("upd", upd);
  newState = update(state, upd);
  //could use an immutable update cycle Here
  state = newState;
  stateStream.onNext(state);
});

initMidi();

module.exports = {
  state: state,
  stateStream: stateStream,
  updateStream: updateStream
};