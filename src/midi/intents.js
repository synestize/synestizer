'use strict';
var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var MidiIn, state, mountpoint, aggregatemidiinstream;

var subjects = {
  something: new Rx.BehaviorSubject(null)
};
var intents = {
  somethingmutate: () => subjects.something.onNext()
}
module.exports = intents;