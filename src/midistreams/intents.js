'use strict';
var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var MidiIn, state, mountpoint, aggregatemidiinstream;

var subjects = {
  selectMidiInDevice: new Rx.Subject(),
  selectMidiInChannel: new Rx.Subject(),
  addMidiInCC: new Rx.Subject(),
  removeMidiInCC: new Rx.Subject(),
  swapMidiInCC: new Rx.Subject()
};
var selectMidiInDevice = (key) => subjects.selectMidiInDevice.onNext(key);
var selectMidiInChannel = (i) => subjects.selectMidiInChannel.onNext(i);
var addMidiInCC = (i) => subjects.addMidiInCC.onNext(i);
var removeMidiInCC = (i) => subjects.removeMidiInCC.onNext(i);
var swapMidiInCC = (i, j) => subjects.swapMidiInCC.onNext([i,j]);

module.exports = {
  subjects: subjects,
  selectMidiInDevice: selectMidiInDevice,
  selectMidiInChannel: selectMidiInChannel,
  addMidiInCC: addMidiInCC,
  removeMidiInCC: removeMidiInCC,
  swapMidiInCC: swapMidiInCC
};