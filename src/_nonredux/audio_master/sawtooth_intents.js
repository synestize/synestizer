'use strict';
var Rx = require('Rx');

var subjects = {
  setSawtoothGain: new Rx.Subject(),
  selectSynthSource: new Rx.Subject(),
  selectSynthSink: new Rx.Subject(),
  selectSynth: new Rx.Subject(),
};

var setSawtoothGain = (i) => subjects.setSawtoothGain.onNext(i);
var selectSynthSource = (i) => subjects.selectSynthSource.onNext(i);
var selectSynthSink = (i) => subjects.selectSynthSink.onNext(i);
var selectSynth = (i) => subjects.selectSynth.onNext(i);

module.exports = {
  subjects: subjects,
  setSawtoothGain: setSawtoothGain,
  selectSynthSource: selectSynthSource,
  selectSynthSink: selectSynthSink,
  selectSynth: selectSynth,
};