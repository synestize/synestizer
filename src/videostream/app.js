//Main entry point for video app
"use strict";

var VideoViews = global.VideoViews = require('./views');
var VideoModels = global.VideoModels = require('./models');

function run(videoinputmountpoint, videodisplaymountpoint) {
  VideoModels.init(videodisplaymountpoint);
  VideoModels.stateStream.subscribe(function (videostate) {
    console.log("renderinvideo");
    console.log(videostate);
    VideoViews.renderVideoIn(
      videostate,
      videoinputmountpoint
    );
  });
};