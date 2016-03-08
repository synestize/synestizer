'use strict';
var Rx = require('Rx');

var subjects = {
  selectVideoInDevice: new Rx.Subject()
};

var selectVideoInDevice = (i) => subjects.selectVideoInDevice.onNext(i);

module.exports = {
  subjects: subjects,
  selectVideoInDevice: selectVideoInDevice
};