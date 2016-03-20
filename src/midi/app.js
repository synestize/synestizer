//Main entry point for midi app
"use strict";

var views = require('./views');
var models = require('./models');
var intents = require('./intents');

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
  return {
    models: models,
    views: views,
    intents: intents,
  };
};

module.exports = run;