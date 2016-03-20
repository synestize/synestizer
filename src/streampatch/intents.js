'use strict';
var Rx = require('Rx');

var subjects = {
  setMappingMag: new Rx.Subject(),
  setMappingSign: new Rx.Subject(),
  setSinkCentralValue: new Rx.Subject(),
};

var setMappingMag = (sourceAddress, sinkAddress, value) => subjects.setMappingMag.onNext([sourceAddress, sinkAddress, value]);
var setMappingSign = (sourceAddress, sinkAddress, value) => subjects.setMappingSign.onNext([sourceAddress, sinkAddress, value]);
var setSinkCentralValue = (address, value) => subjects.setSinkCentralValue.onNext([address, value]);


module.exports = {
  subjects: subjects,
  setMappingMag: setMappingMag,
  setMappingSign: setMappingSign,
  setSinkCentralValue: setMappingSign,
};