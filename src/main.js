//Main entry point for whole app
"use strict";

var Rx = global.Rx = require('Rx');
var React = global.React = require('react');
var ReactDOM = global.React = require('react-dom');
var pureTabs = global.pureTabs = require('./vendor/puretabs/puretabs.js');
pureTabs.init('tabs-link', 'tabs-link-active');

var MidiViews = global.MidiViews = require('./midi/views');
var MidiModels = global.MidiModels = require('./midi/models');
var MidiIntents = global.MidiIntents = require('./midi/intents');


//debug mode:
Rx.config.longStackSupport = true;
MidiModels.stateStream.subscribe((midistate) => MidiViews.renderMidiIn(
  midistate, document.getElementById('midi-input')
));