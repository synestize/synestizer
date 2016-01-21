var Rx, React, ReactDOM, MidiIn, pureTabs;
Rx = global.Rx = require('Rx');
React = global.React = require('react');
ReactDOM = global.React = require('react-dom');
MidiIn = global.MidiIn = require('./media/midiin');
pureTabs = global.pureTabs = require('./vendor/puretabs/puretabs.js');

pureTabs.init('tabs-link', 'tabs-link-active');

MidiIn.init(document.getElementById("midi-input"))