//Main entry point for video app
"use strict";

var views = require('./views');
var models = require('./models');

function run(mountpoint) {
  models.stateSubject.subscribe(function (state) {
    console.log("renderinsynth");
    console.log(state);
    views.render(
      state,
      mountpoint
    );
  });
  return {
    models: models,
  };
};

module.exports = run;