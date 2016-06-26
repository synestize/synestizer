'use strict';
var Rx = require('Rx');

var subjects = {
  selectVideoSource: new Rx.Subject()
};

var selectVideoSource = (i) => subjects.selectVideoSource.onNext(i);

module.exports = {
  subjects: subjects,
  selectVideoSource: selectVideoSource
};