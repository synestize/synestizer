'use strict';
//The simplest model; this is purely a global supply of data streams
//for other models to actually use
// We treat these differently than UI widget stuff; we really don't want to actually have our datasreams re-render the DOM after every update

var Rx = require('Rx');
var update = require('react-addons-update');

var inputDataState = new Map();
var inputDataStreamStateSubject = new Rx.BehaviorSubject(inputDataState);
var inputDataStreamChangeSubject = new Rx.Subject();
var outputDataState = new Map();
var outputDataStreamStateSubject = new Rx.BehaviorSubject(outputDataState);
var outputDataStreamChangeSubject = new Rx.Subject();

inputDataStreamChangeSubject.subscribe(
  function ([key, val]) {
    let upd = {};
    upd[key] = {$set: val};
    inputDataState = update(inputDataState, upd);
    inputDataStreamStateSubject.onNext(inputDataState);
  }
);

outputDataStreamChangeSubject.subscribe(
  function ([key, val]) {
    let upd = {};
    upd[key] = {$set: val};
    outputDataState = update(outputDataState, upd);
    outputDataStreamStateSubject.onNext(outputDataState);
  }
);

module.exports = {
  inputDataStreamStateSubject: inputDataStreamStateSubject,
  inputDataStreamChangeSubject: inputDataStreamChangeSubject,
  outputDataStreamStateSubject: outputDataStreamStateSubject,
  outputDataStreamChangeSubject: outputDataStreamChangeSubject
};