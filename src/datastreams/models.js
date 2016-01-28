'use strict';
//The simplest model; this is purely a global supply of data streams
//for other models to actually use

var Rx = require('Rx');
var update = require('react-addons-update');

var dataState = new Map();
var dataStreamSubject = new Rx.BehaviorSubject(dataState);
var dataStreamUpdateSubject = new Rx.Subject();

dataStreamUpdateSubject.subscribe(
  function (upd) {
    dataState = update(dataState, upd);
    dataStreamSubject.onNext(dataState);
  }
);

module.exports = {
  dataStreamSubject: dataStreamSubject,
  dataStreamUpdateSubject: dataStreamUpdateSubject
};