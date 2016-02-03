//Main entry point for whole app
"use strict";

var Rx = global.Rx = require('Rx');
var pureTabs = global.pureTabs = require('./vendor/puretabs/puretabs.js');
pureTabs.init('tabs-link', 'tabs-link-active');

var AppView = global.AppViews = require('./app/views');
var AppModels = global.AppModels = require('./app/models');


//debug mode:
Rx.config.longStackSupport = true;

AppModels.stateStream.subscribe(function (appstate) {
  console.log("renderin");
  console.log(appstate);
  AppViews.renderApp(
    appstate,
    document.getElementById('app')
  );
});