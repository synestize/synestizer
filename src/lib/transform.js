'use strict';

var R = require('ramda');

// [-1,1] -> [-inf, inf]
var saturate = Math.tanh;
// [-1,1] -> [-inf, inf]
var desaturate = (val) =>  clipinf(Math.atanh(val));

var identity = (x)=>x;

//put together a list of values and weights into a copula
var combine = R.compose(
  desaturate,
  R.sum,
  R.zipWith(
    (val, weight) => saturate(val)*weight
  )
);
//put together a list of values copula-wise with unit weights
var perturb = (vals) => saturate(vals.map(desaturate).reduce((a,b)=>(a+b)))

var clip = function(min, max, val){
  return Math.min(
    Math.max(
      val,
      -min
    ), max
  );
};
//clips to [-1,1]
var clip1 = function(val){
  return Math.min(
    Math.max(
      val,
      -1
    ), 1
  );
};
//clips to finite values; we want to do this because Inf*0=NaN
var clipinf = function(val){
  return Math.min(
    Math.max(
      val,
      -Number.MAX_VALUE
    ), Number.MAX_VALUE
  );
};

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
//we do rounding for integers
var intBipol = function (min, max, val) {
  let range = max-min;
  let middle = (max+min)/2
  return Math.max(Math.min(
    (val-middle) * 2 / range,
  max), min);
};
//we do rounding for integers
var bipolInt = function (min, max, val) {
  let range = max-min;
  let middle = (max+min)/2
  return Math.max(Math.min(
    Math.round(val*range*0.5 + middle),
  max), min);
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
  return (val-63.5)/63.5
};
//[-1,1]->[0,127]
//slightly different to ensure 127 is attainable
var bipolMidi = function (val) {
  return Math.max(Math.min(
    Math.round(val*63.5 + 63.5),
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
var midiFreq = function (val) {
  // 69 = 440Hz
  return Math.pow(2, (val - 69)/12)*440
}
var freqMidi = function (val) {
  // 69 = 440Hz
  return Math.log(val/440)/(Math.LN2) * 12
}
var dbAmp = function(val) {
  return Math.pow(10, val/20);
}
// exponential map to full MIDI spectrum
// defined in a fancy way to correspond to MIDI frequency
// note these are self-invoking functions.
var bipolFreqAll = function() {
  var freqMiddle = midiFreq(127/2);
  var halfOctaves = (127/2/12);
  return (val) => Math.pow(2, clipBipol(val) * halfOctaves)*freqMiddle;
}();

var freqBipolAll = function (val) {
  var freqMiddle = midiFreq(127/2);
  var halfOctaves = (127/2/12);
  return (val) => clipBipol(
    Math.log(2, val/freqMiddle)/(Math.LN2)/halfOctaves
  );
}();

var bipolEquiOctave = function(min, max, val) {
  let logmin = Math.log(min)/Math.LOG2;
  let logmax = Math.log(max)/Math.LOG2;
  return Math.pow(2, bipolLin(logmin, logmax));
}
module.exports = {
  saturate: saturate,
  desaturate: desaturate,
  perturb: perturb,
  combine: combine,
  clip: clip,
  clip1: clip1,
  clipinf: clipinf,
  linBipol: linBipol,
  bipolLin: bipolLin,
  intBipol: intBipol,
  bipolInt: bipolInt,
  clipBipol: clipBipol,
  midiBipol: midiBipol,
  bipolMidi: bipolMidi,
  percBipol: percBipol,
  bipolPerc: bipolPerc,
  freqMidi: freqMidi,
  midiFreq: midiFreq,
  dbAmp: dbAmp,
  freqBipolAll: freqBipolAll,
  bipolFreqAll: bipolFreqAll,
  bipolEquiOctave: bipolEquiOctave,
};
