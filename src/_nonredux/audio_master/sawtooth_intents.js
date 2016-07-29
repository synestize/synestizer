'use strict';
var Rx = require('Rx');

var subjects = {
  setSawtoothGain: new Rx.Subject(),
  selectSynthSource: new Rx.Subject(),
  selectSynthSink: new Rx.Subject(),
  selectSynth: new Rx.Subject(),
};

var setSawtoothGain = (i) => subjects.setSawtoothGain.next(i);
var selectSynthSource = (i) => subjects.mapSynthSource.next(i);
var selectSynthSink = (i) => subjects.mapSynthSink.next(i);
var selectSynth = (i) => subjects.mapSynth.next(i);

module.exports = {
  subjects: subjects,
  setSawtoothGain: setSawtoothGain,
  selectSynthSource: selectSynthSource,
  selectSynthSink: selectSynthSink,
  selectSynth: selectSynth,
};