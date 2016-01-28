//Main entry point for whole app
"use strict";

var Rx = global.Rx = require('Rx');
var React = global.React = require('react');
var ReactDOM = global.React = require('react-dom');
var pureTabs = global.pureTabs = require('./vendor/puretabs/puretabs.js');
pureTabs.init('tabs-link', 'tabs-link-active');

var MidiViews = global.MidiViews = require('./midistreams/views');
var MidiModels = global.MidiModels = require('./midistreams/models');
var DataStreamModels = global.DataStreams = require('./datastreams/models');


//debug mode:
Rx.config.longStackSupport = true;

MidiModels.stateStream.subscribe(function (midistate) {
  console.log("renderin");
  console.log(midistate);
  MidiViews.renderMidiIn(
    midistate,
    document.getElementById('midi-input')
  )
});