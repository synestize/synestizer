'use strict';
var Rx = require('Rx');

var subjects = {
  selectSynthInDevice: new Rx.Subject(),
  selectSynthOutDevice: new Rx.Subject(),
  selectSynth: new Rx.Subject(),
};

var selectSynthInDevice = (i) => subjects.selectSynthInDevice.onNext(i);
var selectSynthOutDevice = (i) => subjects.selectSynthOutDevice.onNext(i);
var selectSynth = (i) => subjects.selectSynth.onNext(i);

module.exports = {
  subjects: subjects,
  selectSynthInDevice: selectSynthInDevice,
  selectSynthOutDevice: selectSynthOutDevice,
  selectSynth: selectSynth,
};