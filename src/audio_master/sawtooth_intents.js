'use strict';
var Rx = require('Rx');

var subjects = {
  setSawtoothGain: new Rx.Subject(),
  selectSynthInDevice: new Rx.Subject(),
  selectSynthOutDevice: new Rx.Subject(),
  selectSynth: new Rx.Subject(),
};

var setSawtoothGain = (i) => subjects.setSawtoothGain.onNext(i);
var selectSynthInDevice = (i) => subjects.selectSynthInDevice.onNext(i);
var selectSynthOutDevice = (i) => subjects.selectSynthOutDevice.onNext(i);
var selectSynth = (i) => subjects.selectSynth.onNext(i);

module.exports = {
  subjects: subjects,
  setSawtoothGain: setSawtoothGain,
  selectSynthInDevice: selectSynthInDevice,
  selectSynthOutDevice: selectSynthOutDevice,
  selectSynth: selectSynth,
};