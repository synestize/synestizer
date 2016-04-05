'use strict';
var Rx = require('Rx');

var subjects = {
  setMasterGain: new Rx.Subject(),
  setMedianMasterTempo: new Rx.Subject(),
  setMedianBaseFreq: new Rx.Subject(),
};

var setMasterGain = (i) => subjects.setMasterGain.onNext(i);
var setMedianMasterTempo = (value) => subjects.setMedianMasterTempo.onNext(value);
var setMedianBaseFreq = (value) => subjects.setMedianBaseFreq.onNext(value);

module.exports = {
  subjects: subjects,
  setMasterGain: setMasterGain,
  setMedianMasterTempo: setMedianMasterTempo,
  setMedianBaseFreq: setMedianBaseFreq,
};