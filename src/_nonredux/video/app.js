//Main entry point for video app
"use strict";

var views = require('./views');
var models = require('./models');
var intents = require('./intents');

function run(inputguimountpoint, displaymountpoint) {
  models.init(displaymountpoint);
  models.stateSubject.subscribe(function (state) {
    console.log("renderinvideo");
    console.log(state);
    views.render(
      state,
      inputguimountpoint
    );
  });
  return {
    models: models,
    views: views,
    intents: intents,
  };
};

module.exports = run;