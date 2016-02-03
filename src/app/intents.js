'use strict';
var Rx = require('Rx');

var subjects = {
  selectPanel: new Rx.Subject()
};

var selectPanel = (i) => subjects.selectPanel.onNext(i);

module.exports = {
  subjects: subjects,
  selectPanel: selectPanel
};