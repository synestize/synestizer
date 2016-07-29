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
var selectMidiSource = (key) => subjects.mapMidiSource.next(key);
var selectMidiSourceChannel = (i) => subjects.mapMidiSourceChannel.next(i);
var addMidiSourceCC = (i) => subjects.addMidiSourceCC.next(i);
var removeMidiSourceCC = (i) => subjects.removeMidiSourceCC.next(i);
var setMidiSourceCC = (a) => subjects.setMidiSourceCC.next(a);
var selectMidiSink = (key) => subjects.mapMidiSink.next(key);
var selectMidiSinkChannel = (i) => subjects.mapMidiSinkChannel.next(i);
var addMidiSinkCC = (i) => subjects.addMidiSinkCC.next(i);
var removeMidiSinkCC = (i) => subjects.removeMidiSinkCC.next(i);
var setMidiSinkCC = (a) => subjects.setMidiSinkCC.next(a);
var soloCC = (i) => subjects.soloCC.next(i);

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