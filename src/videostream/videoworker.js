'use strict';

var Rx = require('Rx');

var inbox = Rx.Observable.fromEvent(self, "message");
var outbox = new Rx.Subject();
var calcState = new Map();
var statistics = new Map();

inbox.subscribe(function(e) {
  console.debug("worker", e);
  
});
outbox.subscribe((msg)=>self.postMessage(msg));