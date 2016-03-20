'use strict';
var Rx = require('Rx');

var subjects = {
  setMasterGain: new Rx.Subject(),
  setMasterTempo: new Rx.Subject(),
};

var setMasterGain = (i) => subjects.setMasterGain.onNext(i);
var setMasterTempo = (i) => subjects.setMasterTempo.onNext(i);

module.exports = {
  subjects: subjects,
  setMasterGain: setMasterGain,
  setMasterTempo: setMasterTempo,
};