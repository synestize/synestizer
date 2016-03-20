//Main entry point for ensemble; not quite an app since the parent synth handles rendering and updates
"use strict";

var views = require('./views');
var models = require('./models');
var intents = require('./intents');

// set up synth in this constructor; return teardown and render functions
function run(mountpoint, audioapp) {
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