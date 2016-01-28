'use strict';
var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var MidiIn, state, mountpoint, aggregatemidiinstream;

var subjects = {
  selectMidiIn: new Rx.Subject(null)
};
var selectMidiIn = (key) => subjects.selectMidiIn.onNext(key);

module.exports = {
  subjects: subjects,
  selectMidiIn: selectMidiIn
};