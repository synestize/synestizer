'use strict';

var Rx = require('Rx');
var update = require('react-addons-update');
var intents = require('./intents');
var dataStreams = require('../streampatch/models');

//Basic video state
var state = {
  activeindevice: null,
};
//video model state
var stateStream = new Rx.BehaviorSubject(state);
//video model updates
var updateStream = new Rx.Subject();

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
  if (videoinfo !==null) {
    if (rawVideoInSubscription !== undefined) {
      rawVideoInSubscription.dispose()
    };
    rawVideoInSubscription = Rx.Observable.fromEvent(
      videoinfo.inputs.get(key), 'videomessage'
    ).subscribe(handleVideoInMessage);
  }
});
//set up video system
function initVideo() {
  Rx.Observable.fromPromise(
    global.navigator.requestMIDIAccess()
  ).subscribe(
    function(newvideoinfo) {
      videoinfo = newvideoinfo;
      //will the automatic video updating work? untested.
      Rx.Observable.fromEvent(videoinfo, 'statechange').subscribe(
        () => updateVideoHardware(videoinfo)
      );
      updateVideoHardware(videoinfo);
    },
    (err) => console.debug(err.stack)
  );
};
function updateVideoHardware(newvideoinfo) {
  var allindevices = new Map();
  var alloutdevices = new Map();
  videoinfo = newvideoinfo;
  //turn the pseudo-Maps in the videoinfo dict into real maps
  for (var [key, val] of videoinfo.inputs.entries()){
    allindevices.set(key,val.name)
  };
  for (var [key, val] of videoinfo.outputs.entries()){
    alloutdevices.set(key,val.name)
  };
  updateStream.onNext({
    allindevices: {$set: allindevices},
    alloutdevices: {$set: alloutdevices}
  });
};

initVideo();

module.exports = {
  stateStream: stateStream,
  updateStream: updateStream
};