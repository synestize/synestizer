/*
Using a Web Worker to send and receive data via an Rx.Subject
https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/subject.md
*/

/* worker.js */

self.onmessage = function(e) {
    self.postMessage(e.data);
};

/* client.js */
var worker = new Worker('worker.js');

// Create observer to handle sending messages
var observer = Rx.Observer.create(
    function (data) {
        worker.postMessage(data);
    });

// Create observable to handle the messages
var observable = Rx.Observable.create(function (obs) {

    worker.onmessage = function (data) {
        obs.onNext(data);
    };

    worker.onerror = function (err) {
        obs.onError(err);
    };

    return function () {
        worker.close();
    };
});

var subject = Rx.Subject.create(observer, observable);

var subscription = subject.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });

subject.onNext(42);


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