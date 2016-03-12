'use strict';
var Rx = require('Rx');

var subjects = {
  setMasterGain: new Rx.Subject(),
  setMasterTempo: new Rx.Subject(),
  selectSynthInDevice: new Rx.Subject(),
  selectSynthOutDevice: new Rx.Subject(),
  selectSynth: new Rx.Subject(),
};

var setMasterGain = (i) => subjects.setMasterGain.onNext(i);
var setMasterTempo = (i) => subjects.setMasterTempo.onNext(i);
var selectSynthInDevice = (i) => subjects.selectSynthInDevice.onNext(i);
var selectSynthOutDevice = (i) => subjects.selectSynthOutDevice.onNext(i);
var selectSynth = (i) => subjects.selectSynth.onNext(i);

module.exports = {
  subjects: subjects,
  setMasterGain: setMasterGain,
  setMasterTempo: setMasterTempo,
  selectSynthInDevice: selectSynthInDevice,
  selectSynthOutDevice: selectSynthOutDevice,
  selectSynth: selectSynth,
};