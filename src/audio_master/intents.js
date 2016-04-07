'use strict';
var Rx = require('Rx');
var sawtooth = require('./sawtooth_intents');

var subjects = {
  setMasterGain: new Rx.Subject(),
  setMedianMasterTempo: new Rx.Subject(),
};

var setMasterGain = (i) => subjects.setMasterGain.onNext(i);
var setMedianMasterTempo = (value) => subjects.setMedianMasterTempo.onNext(value);
var setMedianBaseFreq = (value) => subjects.setMedianBaseFreq.onNext(value);

module.exports = Object.assign({
  setMasterGain: setMasterGain,
  setMedianMasterTempo: setMedianMasterTempo,
  setMedianBaseFreq: setMedianBaseFreq,
}, sawtooth);

module.exports.subjects = Object.assign(subjects, sawtooth.subjects);