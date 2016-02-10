'use strict';

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');
var dataStreams = require('../streampatch/models');

var videoDom;
var videoDomCanvas;
var videoDomVideo;

//Basic video state
var state = {
  allindevices: new Map(),
  activeindevice: null,
};
//video model state
var stateStream = new Rx.BehaviorSubject(state);
//video model updates
var updateStream = new Rx.Subject();
var videodevices = new Map();
var videoworker = null;

//update state object through updateStream
updateStream.subscribe(function (upd) {
  var newState;
  newState = update(state, upd);
  //could use an immutable update cycle Here
  state = newState;
  stateStream.onNext(state);
});

intents.subjects.selectVideoInDevice.subscribe(function(key){
  /******************/
  /******************/
  /******************/
  updateStream.onNext({activeindevice:{$set:key}});
});
//set up video system
//We do touch the DOM here, despite this being the "models" section, because the video *stream* is conceptually outside the UI, but we need to use DOM methods to access it; the video frames are no concern of the React renderer.

function init(newVideoDom) {
  videoDom = newVideoDom;
  videoDomCanvas = videoDom.querySelector('canvas');
  videoDomVideo = videoDom.querySelector('video');
  Rx.Observable.fromPromise(
    navigator.mediaDevices.enumerateDevices()
  ).subscribe(
    updateVideoIO,
    (err) => console.debug(err.stack)
  );
};
function updateVideoIO(mediadevices) {
  var allindevices = new Map();
  videodevices = new Map();
  Rx.Observable.from(mediadevices).filter(
    (dev) => ( dev.kind==="videoinput" )
  ).subscribe(function (dev){
    videodevices.set(dev.deviceId,dev);
    allindevices.set(dev.deviceId,dev.label);
  });
  updateStream.onNext({
    allindevices: {$set: allindevices},
  });
};

module.exports = {
  init: init,
  stateStream: stateStream,
  updateStream: updateStream
};