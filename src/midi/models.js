'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var update = require('react-addons-update');

var state = {
  midiinfo: null,
  allindevices: [],
  alloutdevices: [],
  activeindevices: [],
  activeoutdevices: [],
  incontrols: [],
  outcontrols: []
};
var stateStream = new Rx.BehaviorSubject(state);
var updateStream = new Rx.Subject();

function queryMidi() {
  Rx.Observable.fromPromise(
    global.navigator.requestMIDIAccess()
  ).subscribe(
    (midiinfo) => updateStream.onNext({midiinfo: {set$: midiinfo}}),
    (err) => console.debug(err.stack)
  );
};

updateStream.subscribe(function (upd) {
  var newState = update(state, upd);
  //could use an immutable update cycle Here
  state = newState;
  stateStream.onNext(state);
});

queryMidi();

module.exports = {
  state: state,
  stateStream: stateStream,
  updateStream: updateStream
};