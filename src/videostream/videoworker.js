'use strict';

var Rx = require('Rx');
var Statistic = require('./statistic');
var statistics = new Map();
var inbox = Rx.Observable.fromEvent(self, "message").select((e) => e.data);
var outbox = new Rx.Subject();
var calcState = new Map();
var PIXELDIM;

outbox.subscribe((msg)=>self.postMessage(msg));

inbox.where((x)=>(x.topic==="settings")).subscribe(function(data) {
  console.debug("settings", data.topic, data.payload);
  PIXELDIM = data.PIXELDIM;
  calcState = new Map();
  statistics = new Map();
  for (var [statistic, params] of data.settings.statistics.entries()) {
    var statFn = Statistic.get(statistic)(params);
    statistics.set(statistic, statFn);
    calcState.set(statistic, Float32Array(statFn.nDims));
  }
});
inbox.where((x)=>(x.topic==="pixels")).subscribe(function(data) {
  console.debug("workerpixels", data.topic, data.payload);
  
});

