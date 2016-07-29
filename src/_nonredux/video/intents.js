'use strict';
var Rx = require('Rx');

var subjects = {
  selectVideoSource: new Rx.Subject()
};

var selectVideoSource = (i) => subjects.mapVideoSource.next(i);

module.exports = {
  subjects: subjects,
  selectVideoSource: selectVideoSource
};