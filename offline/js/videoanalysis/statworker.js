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