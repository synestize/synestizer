//Main entry point for whole app
"use strict";

var Rx = global.Rx = require('Rx');
var React = global.React = require('react');
var pureTabs = global.pureTabs = require('./vendor/puretabs/puretabs.js');
pureTabs.init('tabs-link', 'tabs-link-active');

var MidiViews = global.MidiViews = require('./midistream/views');
var MidiModels = global.MidiModels = require('./midistream/models');
var StreamPatchModels = global.StreamPatchModels = require('./streampatch/models');


//debug mode:
Rx.config.longStackSupport = true;

MidiModels.stateStream.subscribe(function (midistate) {
  console.log("renderin");
  console.log(midistate);
  MidiViews.renderMidiIn(
    midistate,
    document.getElementById('midi-input')
  );
  MidiViews.renderMidiOut(
    midistate,
    document.getElementById('midi-output')
  )
});