'use strict';
var Rx = require('Rx');

var subjects = {
  selectMidiInDevice: new Rx.Subject(),
  selectMidiInChannel: new Rx.Subject(),
  addMidiInCC: new Rx.Subject(),
  removeMidiInCC: new Rx.Subject(),
  setMidiInCC: new Rx.Subject(),
  selectMidiOutDevice: new Rx.Subject(),
  selectMidiOutChannel: new Rx.Subject(),
  addMidiOutCC: new Rx.Subject(),
  removeMidiOutCC: new Rx.Subject(),
  setMidiOutCC: new Rx.Subject(),
  soloCC: new Rx.Subject()
};
var selectMidiInDevice = (key) => subjects.selectMidiInDevice.onNext(key);
var selectMidiInChannel = (i) => subjects.selectMidiInChannel.onNext(i);
var addMidiInCC = (i) => subjects.addMidiInCC.onNext(i);
var removeMidiInCC = (i) => subjects.removeMidiInCC.onNext(i);
var setMidiInCC = (a) => subjects.setMidiInCC.onNext(a);
var selectMidiOutDevice = (key) => subjects.selectMidiOutDevice.onNext(key);
var selectMidiOutChannel = (i) => subjects.selectMidiOutChannel.onNext(i);
var addMidiOutCC = (i) => subjects.addMidiOutCC.onNext(i);
var removeMidiOutCC = (i) => subjects.removeMidiOutCC.onNext(i);
var setMidiOutCC = (a) => subjects.setMidiOutCC.onNext(a);
var soloCC = (i) => subjects.soloCC.onNext(i);

module.exports = {
  subjects: subjects,
  selectMidiInDevice: selectMidiInDevice,
  selectMidiInChannel: selectMidiInChannel,
  addMidiInCC: addMidiInCC,
  removeMidiInCC: removeMidiInCC,
  setMidiInCC: setMidiInCC,
  selectMidiOutDevice: selectMidiOutDevice,
  selectMidiOutChannel: selectMidiOutChannel,
  addMidiOutCC: addMidiOutCC,
  removeMidiOutCC: removeMidiOutCC,
  setMidiOutCC: setMidiOutCC,
  soloCC: soloCC,
};