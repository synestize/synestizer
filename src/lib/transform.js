'use strict';

// [min, max]->[-1,1]
var linBipol = function(min, max, val) {
  let range = max-min;
  let middle = (max+min)/2;
  return Math.min(
    Math.max(
      (val - middle) * 2 / range,
      -1
    ), 1
  );
};
// [-1,1]->[min, max]
var bipolLin = function(min, max, val) {
  let range = max-min;
  let middle = (max+min)/2
  return Math.min(
    Math.max(
      val * range * 0.5 + middle,
      min
    ), max
  );
};
var clipBipol = function(val) {
  return Math.min(
    Math.max(
      val,
      -1
    ), 1
  );
};
//[0,127]->[-1,1]
var midiBipol = function (val) {
  return val/127
};
//[-1,1]->[0,127]
//slightly different to ensure 127 is attainable
var bipolMidi = function (val) {
  return Math.max(Math.min(
    Math.round(val*127),
  127), 0)
};
//[0,100]->[-1,1]
var percBipol = function (val) {
  return Math.min(
    Math.max(
      (val-50)/50,
      -1
    ), 1
  );
};
//[-1,1]->[0,100]
//slightly different to ensure 127 is attainable
var bipolPerc = function (val) {
  return Math.max(Math.min(
    Math.round(val*50+50),
  100), 0)
};

module.exports = {
  linBipol: linBipol,
  bipolLin: bipolLin,
  clipBipol: clipBipol,
  midiBipol: midiBipol,
  bipolMidi: bipolMidi,
  percBipol: percBipol,
  bipolPerc: bipolPerc,
};