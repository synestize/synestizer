'use strict';
var Rx = require('Rx');
var MidiModels = global.MidiModels = require('../midistream/models');
var VideoModels = global.VideoModels = require('../videostream/models');
var StreamPatchModels = global.StreamPatchModels = require('../streampatch/models');

var state = {
  activepanel: null,
  videostate: null,
  midistate: null,
  patchstate: null,
};

//midi model state
var stateStream = new Rx.BehaviorSubject(state);
//midi model updates
var updateStream = new Rx.Subject();

MidiModels.stateStream.subscribe(function (midistate) {
  console.log("renderinmidi");
  console.log(midistate);
  state = update(state, {midistate: {$set: midistate}});
  stateStream.onNext(state);
});




