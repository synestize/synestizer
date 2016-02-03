//Main entry point for video app
"use strict";

var VideoViews = global.VideoViews = require('./views');
var VideoModels = global.VideoModels = require('./models');

function run(videoinputmountpoint, videooutputmountpoint) {
  VideoModels.stateStream.subscribe(function (videostate) {
    console.log("renderin");
    console.log(videostate);
    VideoViews.renderVideoIn(
      videostate,
      videoinputmountpoint
    );
  });
};