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

var Videoworker_ = require('worker!./videoworker');
var videoworker =  Videoworker_();
//console.debug("vw",videoworker);
window.videoworker = videoworker;
window.Videoworker_ = Videoworker_;

var videoDom;
var canvasElem;
var videoElem;
var gfxCtx;

//our stream of pixel arrays
var statsInbox = Rx.Observer.create(
  function (data) {
    /*
     * Dasta looks like {topic:"pixels", payload: [1,2,3,...]}
     */
    //this should do transfer of arrays to save time
    let payload = data.payload;
    if (payload.buffer !== undefined) {
      videoworker.postMessage(data, [payload.buffer]);
    } else {
      videoworker.postMessage(data);
    }
  }
);
var statsOutbox = Rx.Observable.create(function (obs) {
    videoworker.onmessage = function (e) {
        obs.onNext(e.data);
    };
    videoworker.onerror = function (err) {
        obs.onError(e.err);
    };
    return function () {
        videoworker.close();
    };
});
var statsSubject = Rx.Subject.create(statsInbox, statsOutbox);

statsSubject.where((x)=>(x.topic==="results")).subscribe(function(x) {
  //console.debug("got stuff back",x);
  //report data streams
  statsStreamPublish(x.payload);
  //Now repeat
  Rx.Scheduler.default.scheduleFuture(
    null,
    20,
    pumpPixels
  );
});
function statsStreamPublish(x) {
  for (var [key, data] of x) {
    for (var [index, value] of data.entries()) {
    //console.log("video-" + key + "-" + index +  ", " + value);
  }
}
  //console.debug(x);
}
//the browser's opaque media streams which we will need to process into pixel arrays
var mediaStream;

const PIXELDIM=64

statsInbox.onNext({
  topic: "settings",
  payload: {
    statistics: new Map([["PluginMoments", {PIXELDIM: PIXELDIM}]])
  }
});

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
  canvasElem.width = PIXELDIM;
  canvasElem.height = PIXELDIM;
  
  Rx.Observable.fromPromise(
    navigator.mediaDevices.getUserMedia({deviceId:key, video:true})
  ).subscribe(function(mediaStream) {
    //we can play the video now, but we need to get video metadata before the dimensions work etc, so we start from the onloaded event.
    Rx.Observable.fromEvent(
      videoElem, "loadedmetadata").subscribe(pumpPixels);
    videoElem.src = window.URL.createObjectURL(mediaStream);
    videoElem.play();
  });
  
  gfxCtx = canvasElem.getContext('2d');
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
  vw = videoElem.videoWidth;
  vh = videoElem.videoHeight;
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
        videoElem,
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
  let p = grabPixels();
  //console.debug("pumpPixels", p);
  statsInbox.onNext({topic:"pixels", payload: p})
}

function updateStats () {
  
}


function init(newVideoDom) {
  //set up video system
  //We do touch the DOM here, despite this being the "models" section, because the video *stream* is conceptually outside the UI, but we need to use DOM methods to access it; the video frames are no concern of the React renderer.
  videoDom = newVideoDom;
  canvasElem = videoDom.querySelector('canvas');
  videoElem = videoDom.querySelector('video');
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