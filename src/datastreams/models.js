'use strict';
//The simplest model; this is purely a global supply of data streams
//for other models to actually use
// We treat these a little different than UI widget stuff; we really don't want to actually have our datasreams re-render the DOM after every update

var Rx = require('Rx');
var update = require('react-addons-update');

var inputDataState = new Map();
var inputDataStreamSubject = new Rx.BehaviorSubject(inputDataState);
var inputDataStreamUpdateSubject = new Rx.Subject();
var outputDataState = new Map();
var outputDataStreamSubject = new Rx.BehaviorSubject(outputDataState);
var outputDataStreamUpdateSubject = new Rx.Subject();

inputDataStreamUpdateSubject.subscribe(
  function (upd) {
    inputDataState = update(inputDataState, upd);
    inputDataStreamSubject.onNext(inputDataState);
  }
);

outputDataStreamUpdateSubject.subscribe(
  function (upd) {
    outputDataState = update(outputDataState, upd);
    outputDataStreamSubject.onNext(outputDataState);
  }
);

module.exports = {
  inputDataStreamSubject: inputDataStreamSubject,
  inputDataStreamUpdateSubject: inputDataStreamUpdateSubject,
  outputDataStreamSubject: outputDataStreamSubject,
  outputDataStreamUpdateSubject: outputDataStreamUpdateSubject
};