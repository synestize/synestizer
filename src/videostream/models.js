'use strict';

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');
var dataStreams = require('../streampatch/models');

//Basic video state
var state = {
  allindevices: new Map(), //id-> device name map
  activeindevice: null, //id
};
//video model state
var stateStream = new Rx.BehaviorSubject(state);
//video model updates
var updateStream = new Rx.Subject();

var videoindevices = new Map(); //id -> device
var videoindevice; //device

var videoworker = null;
var videoDom;
var videoDomCanvas;
var videoDomVideo;
var gfxCtx;

//our stream of pixel arrays
var pixelStream = new Rx.Subject();
//the browser's opaque media streams which we will need to process into pixel arrays
var mediaStream;

const PIXELDIM=64


//update state object through updateStream
updateStream.subscribe(function (upd) {
  var newState;
  newState = update(state, upd);
  //could use an immutable update cycle Here
  state = newState;
  stateStream.onNext(state);
});

intents.subjects.selectVideoInDevice.subscribe(function(key){
  doVideoPlumbing(key);
  updateStream.onNext({activeindevice:{$set:key}});
});

function doVideoPlumbing(key) {
  videoindevice = videoindevices.get(key);
  videoDomCanvas.width = PIXELDIM;
  videoDomCanvas.height = PIXELDIM;
  
  Rx.Observable.fromPromise(
    navigator.mediaDevices.getUserMedia({deviceId:key, video:true})
  ).subscribe(function(mediaStream) {
    //we can play the video now, but we need to get video metadata before the dimensions work etc, so we start from the onloaded event.
    Rx.Observable.fromEvent(
      videoDomVideo, "loadedmetadata").subscribe(pumpPixels);
    videoDomVideo.src = window.URL.createObjectURL(mediaStream);
    videoDomVideo.play();
  });
  
  gfxCtx = videoDomCanvas.getContext('2d');
}

function grabPixels() {
  var vw, vh, vAspect;
  var xoffset, yoffset, vsize;
  /*
  This should return the size of the *video*,
  not the *video element*,
  although it may also return nonsense for the first few frames.
  so we only do this on the loadedmetadata event,
  */
  vw = vidElem.videoWidth;
  vh = vidElem.videoHeight;
  //so once again we guess!
  vAspect = vw/vh;
  vsize = Math.min(vw, vh);
  if (vAspect<1){ //taller than wide
      xoffset = 0;
      yoffset = Math.floor((vh-vsize)/2);
  } else { //wider than tall
      xoffset = Math.floor((vw-vsize)/2);
      yoffset = 0;
  };
  // console.debug("cv", vw, vh, vAspect, vsize, xoffset, yoffset);
  // The first few frames get lost in Firefox, raising exceptions
  // We make sure this does not break the whole loop by
  // using a try..catch
  // TODO: check that this is still true
  try {
    //slice a square section out of the video
    //looks a bit sqished on my laptop, but whatever.
    gfxCtx.drawImage(
        vidElem,
        xoffset, yoffset, xoffset+vsize, yoffset+vsize,
        0, 0, PIXELDIM, PIXELDIM
    );
    return gfxCtx.getImageData(
        0, 0,
        PIXELDIM, PIXELDIM).data || [];
  } catch (e) {
      console.debug("error getting video frame", e);
  }
}
function pumpPixels() {
  pixelStream.onNext(grabPixels())
}
function init(newVideoDom) {
  //set up video system
  //We do touch the DOM here, despite this being the "models" section, because the video *stream* is conceptually outside the UI, but we need to use DOM methods to access it; the video frames are no concern of the React renderer.
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
  /*
  updates lists of available devices.
  */
  var allindevices = new Map();
  videoindevices = new Map();
  Rx.Observable.from(mediadevices).filter(
    (dev) => ( dev.kind==="videoinput" )
  ).subscribe(function (dev){
    videoindevices.set(dev.deviceId,dev);
    allindevices.set(dev.deviceId,dev.label);
  });
  updateStream.onNext({
    allindevices: {$set: allindevices},
  });
  window.videoindevices = videoindevices;
  //If there is only one device, select it.
  if (allindevices.size===1) {
    for (let key of allindevices.keys()) {intents.selectVideoInDevice(key)}
  }
};

module.exports = {
  init: init,
  stateStream: stateStream,
  updateStream: updateStream,
};