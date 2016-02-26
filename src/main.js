//Main entry point for whole app
"use strict";

var Rx = global.Rx = require('Rx');
//debug mode:
Rx.config.longStackSupport = true;

var pureTabs = global.pureTabs = require('./vendor/puretabs/puretabs.js');
pureTabs.init('tabs-link', 'tabs-link-active');

var MidiApp = global.MidiApp = require('./midi/app');
var VideoApp = global.VideoApp = require('./video/app');
var StreamPatchApp = global.StreamPatchApp = require('./streampatch/app');


MidiApp(
  document.getElementById('midi-input'),
  document.getElementById('midi-output')
);

VideoApp(
  document.getElementById('video-input'),
  document.getElementById('video-display')
);

StreamPatchApp(
  document.getElementById('iomatrix-tab')
)
