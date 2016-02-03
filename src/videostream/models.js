'use strict';

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');
var dataStreams = require('../streampatch/models');

var videoDom;
//Basic video state
var state = {
  activeindevice: null,
  allindevices: null,
};
//video model state
var stateStream = new Rx.BehaviorSubject(state);
//video model updates
var updateStream = new Rx.Subject();
var videodevices= new Map();

//update state object through updateStream
updateStream.subscribe(function (upd) {
  var newState;
  newState = update(state, upd);
  //could use an immutable update cycle Here
  state = newState;
  stateStream.onNext(state);
});

intents.subjects.selectVideoInDevice.subscribe(function(key){
  var tmp;
  updateStream.onNext({activeindevice:{$set:key}});
  /******************/
  /******************/
  /******************/
});
//set up video system
function init(newVideoDom) {
  videoDom = newVideoDom;
  Rx.Observable.fromPromise(
    navigator.mediaDevices.enumerateDevices()
  ).subscribe(
    updateVideoHardware,
    (err) => console.debug(err.stack)
  );
};
function updateVideoHardware(mediadevices) {
  var allindevices = new Map();
  videodevices = new Map();
  Rx.Observable.from(mediadevices).filter(
    (dev) => (dev.kind==="videoinput")
  ).subscribe(function (dev){
    videodevices.set(dev.deviceid,dev);
    videodevices.set(dev.deviceid,dev.label);
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