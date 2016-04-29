'use strict';

var Rx = require('Rx');
var Statistic = require('./statistic');
var statistics = new Map();

var inbox = Rx.Observable.fromEvent(self, "message").select((e) => e.data);
var outbox = new Rx.Subject();
var results = new Map();

outbox.subscribe((msg)=>{
  self.postMessage(msg)
});

inbox.where((x)=>(x.topic==="settings")).subscribe(function(data) {
  // console.debug("settings", data.topic, data.payload);
  statistics = new Map();
  for (var [statisticKey, params] of data.payload.statistics.entries()) {
    var statFn = Statistic.get(statisticKey)(params);
    statistics.set(statisticKey, statFn);
  }
});
inbox.where((x)=>(x.topic==="pixels")).subscribe(function(data) {
  //console.debug("workerpixels", data.topic, data.payload);
  for (var [statisticKey, statFn] of statistics.entries()) {
    results.set(statisticKey, statFn(data.payload));
  };
  outbox.onNext({
    topic: "results",
    payload: results
  });
});
