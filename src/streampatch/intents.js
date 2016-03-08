'use strict';
var Rx = require('Rx');

var subjects = {
  addSourceFor: new Rx.Subject(),
  removeSourceFor: new Rx.Subject(),
  addSinkFor: new Rx.Subject(),
  removeSinkFor: new Rx.Subject(),
  setMappingMag: new Rx.Subject(),
  setMappingSign: new Rx.Subject(),
};

var addSourceFor = (sourceKey, i) => subjects.addSourceFor.onNext([sourceKey, i]);
var removeSourceFor = (sourceKey, i) => subjects.removeSourceFor.onNext([sourceKey, i]);
var setSourceAddressesFor = (sourceKey, streams) => subjects.setSourceAddressesFor([sourceKey, streams])
var addSinkFor = (sinkKey, i) => subjects.addSinkFor.onNext([sinkKey, i]);
var removeSinkFor = (sinkKey, i) => subjects.removeSinkFor.onNext([sinkKey, i]);
var setSinkAddressesFor = (sinkKey, streams) => subjects.setSinkAddressesFor.onNext([sinkKey, streams]);
var setMappingMag = (sourceAddress, sinkAddress, value) => subjects.setMappingMag.onNext([sourceAddress, sinkAddress, value]);
var setMappingSign = (sourceAddress, sinkAddress, value) => subjects.setMappingSign.onNext([sourceAddress, sinkAddress, value]);


module.exports = {
  subjects: subjects,
  addSourceFor: addSourceFor,
  removeSourceFor: removeSourceFor,
  setSourceAddressesFor: setSourceAddressesFor,
  addSinkFor: addSinkFor,
  removeSinkFor: removeSinkFor,
  setSinkAddressesFor: setSinkAddressesFor,
  setMappingMag: setMappingMag,
  setMappingSign: setMappingSign,
};