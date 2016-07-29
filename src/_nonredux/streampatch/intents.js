'use strict';
var Rx = require('Rx');

var subjects = {
  setMappingMag: new Rx.Subject(),
  setMappingSign: new Rx.Subject(),
};

var setMappingMag = (sourceAddress, sinkAddress, value) => subjects.setMappingMag.next([sourceAddress, sinkAddress, value]);
var setMappingSign = (sourceAddress, sinkAddress, value) => subjects.setMappingSign.next([sourceAddress, sinkAddress, value]);


module.exports = {
  subjects: subjects,
  setMappingMag: setMappingMag,
  setMappingSign: setMappingSign,
};