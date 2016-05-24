//Main entry point for audio app
"use strict";

var views = require('./views');
var models = require('./models');
var intents = require('./intents');

function run(mountpoint) {
  models.init();
  models.stateSubject.throttle(30).subscribe(function (state) {
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