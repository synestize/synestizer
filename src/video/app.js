//Main entry point for video app
"use strict";

var views = global.VideoViews = require('./views');
var models = global.VideoModels = require('./models');

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
  };
};

module.exports = run;