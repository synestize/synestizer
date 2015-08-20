/*
Using a Web Worker to send and receive data via an Rx.Subject
https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/subject.md
*/

/* statworker.js */
importScripts('../../bower_components/rxjs/dist/rx.all.js');
importScripts('./statistic.js');

var self = this;
var statfns = [];

console.debug("in statworker.js", self);

var observer = Rx.Observer.create(
    function (data) {
        self.postMessage(data);
    });

// Create observable to handle the messages
var observable = Rx.Observable.create(function (obs) {
    self.onmessage = function (data) {
        console.debug("statsworker obs got", data);
        obs.onNext(data);
    };

    self.onerror = function (err) {
        console.debug("statsworker obs error", err);
        obs.onError(err);
    };

    return function () {
        self.close();
    };
});

var parentSubject = Rx.Subject.create(observer, observable);

var subscription = parentSubject.subscribe(
    function (x) {
        console.log('Statsworker Next:', x);
    },
    function (err) {
        console.log('Statsworker Error:', err);
    },
    function () {
        console.log('Completed');
    });

//parentSubject.onNext("inited");

function initStats(statMetadataList) {
    statfns = initStats.map(function(blarg){
        console.debug(blarg);
        return blarg;
    })
}

function calcStats(options) {
    
}

////////////////////////////////////////////////////////////////////////
// For comparison, the Rx.dom implementation
////////////////////////////////////////////////////////////////////////


/**
 * Creates a Web Worker with a given URL as a Subject.
 *
 * @example
 * var worker = Rx.DOM.fromWebWorker('worker.js');
 *
 * @param {String} url The URL of the Web Worker.
 * @returns {Subject} A Subject wrapping the Web Worker.
 */
/*
dom.fromWebWorker = function (url) {
  if (!root.Worker) { throw new TypeError('Worker not implemented in your runtime.'); }
  var worker = new root.Worker(url);

  var observable = new AnonymousObservable(function (obs) {

    function messageHandler(data) { obs.onNext(data); }
    function errHandler(err) { obs.onError(err); }

    worker.addEventListener('message', messageHandler, false);
    worker.addEventListener('error', errHandler, false);

    return function () {
      worker.close();
      worker.removeEventListener('message', messageHandler, false);
      worker.removeEventListener('error', errHandler, false);
    };
  });

  var observer = observerCreate(function (data) {
    worker.postMessage(data);
  });

  return Subject.create(observer, observable);
};
*/