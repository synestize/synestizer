//Main entry point for midi app
"use strict";

var MidiViews = global.MidiViews = require('./views');
var MidiModels = global.MidiModels = require('./models');

function run(midiinputmountpoint, midioutputmountpoint) {
  MidiModels.stateStream.subscribe(function (midistate) {
    console.log("renderin");
    console.log(midistate);
    MidiViews.renderMidiIn(
      midistate,
      midiinputmountpoint
    );
    MidiViews.renderMidiOut(
      midistate,
      midioutputmountpoint
    );
  });
};

module.exports = run;