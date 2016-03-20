//Main entry point for stream patching app
"use strict";

var views = require('./views');
var models = require('./models');

function run(mountpoint) {
  models.stateSubject.subscribe(function (state) {
    // console.log("renderinstreampatch");
    // console.log(state);
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