'use strict';
var Rx = require('Rx');

var subjects = {
  addStream: new Rx.Subject(),
  removeStream: new Rx.Subject(),
};

var addStream = (i) => subjects.addStream.onNext(i);
var removeStream = (i) => subjects.removeStream.onNext(i);

module.exports = {
  subjects: subjects,
  addStream: addStream,
  removeStream: removeStream,
};