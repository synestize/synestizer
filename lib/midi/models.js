//  MIDI input. This is a singleton.

'use strict';
var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var MidiIn, state, mountpoint, aggregatemidiinstream;
var state = {
  indevices: [],
  activeindevices: [],
  incontrols: []
};
var MidiDeviceStream = new Rx.ReplaySubject(1);
