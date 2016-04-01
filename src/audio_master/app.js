//Main entry point for audio app
"use strict";

var views = require('./views');
var models = require('./models');
var intents = require('./intents');

function run(mountpoint) {
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