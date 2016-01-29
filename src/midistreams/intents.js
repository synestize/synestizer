'use strict';
var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var MidiIn, state, mountpoint, aggregatemidiinstream;

var subjects = {
  selectMidiInDevice: new Rx.BehaviorSubject(null),
  selectMidiInChannel: new Rx.BehaviorSubject(1),
  selectMidiInCC: new Rx.BehaviorSubject(1)
};
var selectMidiInDevice = (key) => subjects.selectMidiInDevice.onNext(key);
var selectMidiInChannel = (i) => subjects.selectMidiInChannel.onNext(i);
var selectMidiInCC = (i) => subjects.selectMidiInCC.onNext(i);

module.exports = {
  subjects: subjects,
  selectMidiInDevice: selectMidiInDevice,
  selectMidiInChannel: selectMidiInChannel,
  selectMidiInCC: selectMidiInCC
};