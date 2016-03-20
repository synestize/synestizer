//Main entry point for ensemble; not quite an app since the parent synth handles rendering and updates
"use strict";

var views = require('./views');
var models = require('./models');

// set up synth in this constructor; return teardown and render functions
function run(mountpoint, audioapp) {
  // Fancy init for audio app.
  // I feel uneasy about this
  models.init(audioapp);
  models.stateSubject.subscribe(function (state) {
    console.log("renderinaudio");
    console.log(state);
    views.render(
      state,
      mountpoint
    );
  });
  return {
    models: models,
    views: views,
    intents: intents,
  };
};

module.exports = run;