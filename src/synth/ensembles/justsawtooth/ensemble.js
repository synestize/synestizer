//Main entry point for ensemble; not quite an app since the parent synth handles rendering and updates
"use strict";

var views = require('./views');
var models = require('./models');

// set up synth in this constructor; return teardown and render functions
function run(mountpoint, ensembleKey, synthmodels) {
  var cleanup = function() {};
  return {
    cleanup: cleanup,
    render: views.render,
    models: models,
  };
};

module.exports = run;