'use strict';
var Rx = require('Rx');

var subjects = {
  setMasterGain: new Rx.Subject(),
  setMedian: new Rx.Subject(),
};

var setMasterGain = (i) => subjects.setMasterGain.onNext(i);
var setMedian = (address, value) => subjects.setMedian.onNext(address, value);

module.exports = {
  subjects: subjects,
  setMasterGain: setMasterGain,
  setMedian: setMedian,
};