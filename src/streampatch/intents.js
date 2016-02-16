'use strict';
var Rx = require('Rx');

var subjects = {
  addSourceFor: new Rx.Subject(),
  removeSourceFor: new Rx.Subject(),
  addSinkFor: new Rx.Subject(),
  removeSinkFor: new Rx.Subject(),
};

var addSourceFor = (sourceKey, i) => subjects.addSourceFor.onNext([sourceKey, i]);
var removeSourceFor = (sourceKey, i) => subjects.removeSourceFor.onNext([sourceKey, i]);
var setSourceAddressesFor = (sourceKey, streams) => subjects.setSourceAddressesFor([sourceKey, streams])
var addSinkFor = (sourceKey, i) => subjects.addSinkFor.onNext([sourceKey, i]);
var removeSinkFor = (sourceKey, i) => subjects.removeSinkFor.onNext([sourceKey, i]);
var setSinkAddressesFor = (sourceKey, streams) => subjects.setSinkAddressesFor([sourceKey, streams])

module.exports = {
  subjects: subjects,
  addSourceFor: addSourceFor,
  removeSourceFor: removeSourceFor,
  setSourceAddressesFor: setSourceAddressesFor,
  addSinkFor: addSinkFor,
  removeSinkFor: removeSinkFor,
  setSinkAddressesFor: setSinkAddressesFor,
};