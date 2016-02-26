//Main entry point for midi app
"use strict";

var views = global.midiviews = require('./views');
var models = global.midimodels = require('./models');

function run(midiinputmountpoint, midioutputmountpoint) {
  models.init();
  models.stateSubject.subscribe(function (midistate) {
    console.log("renderinmidi");
    console.log(midistate);
    views.renderMidiIn(
      midistate,
      midiinputmountpoint
    );
    views.renderMidiOut(
      midistate,
      midioutputmountpoint
    );
  });
};

module.exports = run;