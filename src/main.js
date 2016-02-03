//Main entry point for whole app
"use strict";

var Rx = global.Rx = require('Rx');
var pureTabs = global.pureTabs = require('./vendor/puretabs/puretabs.js');
pureTabs.init('tabs-link', 'tabs-link-active');

var MidiApp = global.MidiApp = require('./midistream/app');
var VideoApp = global.VideoApp = require('./videostream/app');

//debug mode:
Rx.config.longStackSupport = true;

MidiApp(
  document.getElementById('midi-input'),
  document.getElementById('midi-output')
);
MidiApp(
  document.getElementById('video-input'),
  document.getElementById('video-display')
);
