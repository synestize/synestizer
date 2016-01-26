//Main entry point for whole app

var Rx, React, ReactDOM, MidiIn, pureTabs;
Rx = global.Rx = require('Rx');
React = global.React = require('react');
ReactDOM = global.React = require('react-dom');
pureTabs = global.pureTabs = require('./vendor/puretabs/puretabs.js');
pureTabs.init('tabs-link', 'tabs-link-active');

//MidiIn = global.MidiIn = require('./midi/midiin');

//MidiIn.init(document.getElementById("midi-input"));

