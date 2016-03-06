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
}

module.exports = {
  linBipol: linBipol,
  bipolLin: bipolLin,
  clipBipol: clipBipol,
};