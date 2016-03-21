'use strict';
var Rx = require('Rx');

var subjects = {
  setMasterGain: new Rx.Subject(),
  setCentralValue: new Rx.Subject(),
};

var setMasterGain = (i) => subjects.setMasterGain.onNext(i);
var setCentralValue = (i) => subjects.setCentralValue.onNext(i);

module.exports = {
  subjects: subjects,
  setMasterGain: setMasterGain,
  setCentralValue: setCentralValue,
};