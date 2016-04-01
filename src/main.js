//Main entry point for whole app
"use strict";

var Rx = global.Rx = require('Rx');
//debug mode:
Rx.config.longStackSupport = true;

var pureTabs = global.pureTabs = require('./vendor/puretabs/puretabs.js');
pureTabs.init('tabs-link', 'tabs-link-active');

var MidiApp = require('./midi/app');
var VideoApp = require('./video/app');
var StreamPatchApp = require('./streampatch/app');
var AudioMasterApp = require('./audio_master/app');
//var AudioJustSawtoothApp = require('./audio_justsawtooth/app');

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
);

AudioMasterApp(
  document.getElementById('audio-master')
);
/*
AudioJustSawtoothApp(
  document.getElementById('audio-justsawtooth')
);
*/
