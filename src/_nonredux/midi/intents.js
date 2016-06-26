'use strict';
var Rx = require('Rx');

var subjects = {
  selectMidiSource: new Rx.Subject(),
  selectMidiSourceChannel: new Rx.Subject(),
  addMidiSourceCC: new Rx.Subject(),
  removeMidiSourceCC: new Rx.Subject(),
  setMidiSourceCC: new Rx.Subject(),
  selectMidiSink: new Rx.Subject(),
  selectMidiSinkChannel: new Rx.Subject(),
  addMidiSinkCC: new Rx.Subject(),
  removeMidiSinkCC: new Rx.Subject(),
  setMidiSinkCC: new Rx.Subject(),
  soloCC: new Rx.Subject()
};
var selectMidiSource = (key) => subjects.selectMidiSource.onNext(key);
var selectMidiSourceChannel = (i) => subjects.selectMidiSourceChannel.onNext(i);
var addMidiSourceCC = (i) => subjects.addMidiSourceCC.onNext(i);
var removeMidiSourceCC = (i) => subjects.removeMidiSourceCC.onNext(i);
var setMidiSourceCC = (a) => subjects.setMidiSourceCC.onNext(a);
var selectMidiSink = (key) => subjects.selectMidiSink.onNext(key);
var selectMidiSinkChannel = (i) => subjects.selectMidiSinkChannel.onNext(i);
var addMidiSinkCC = (i) => subjects.addMidiSinkCC.onNext(i);
var removeMidiSinkCC = (i) => subjects.removeMidiSinkCC.onNext(i);
var setMidiSinkCC = (a) => subjects.setMidiSinkCC.onNext(a);
var soloCC = (i) => subjects.soloCC.onNext(i);

module.exports = {
  subjects: subjects,
  selectMidiSource: selectMidiSource,
  selectMidiSourceChannel: selectMidiSourceChannel,
  addMidiSourceCC: addMidiSourceCC,
  removeMidiSourceCC: removeMidiSourceCC,
  setMidiSourceCC: setMidiSourceCC,
  selectMidiSink: selectMidiSink,
  selectMidiSinkChannel: selectMidiSinkChannel,
  addMidiSinkCC: addMidiSinkCC,
  removeMidiSinkCC: removeMidiSinkCC,
  setMidiSinkCC: setMidiSinkCC,
  soloCC: soloCC,
};