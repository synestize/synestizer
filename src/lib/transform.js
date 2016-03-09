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
var midiFreq = function (val) {
  // 69 = 440Hz
  return Math.pow(2, (val - 69)/12)*440
}
var freqMidi = function (val) {
  // 69 = 440Hz
  return Math.log(val/440)/(Math.LN2) * 12 
}
// exponential map to full MIDI spectrum
// defined in a fancy way to correspond to MIDI frequency
// note these are self-invoking functions.
var bipolFreq = function() {
  var freqMiddle = midiFreq(127/2);
  var halfOctaves = (127/2/12);
  return (val) => Math.pow(2, clipBipol(val) * halfOctaves)*freqMiddle; 
}();

var freqBipol = function (val) {
  var freqMiddle = midiFreq(127/2);
  var halfOctaves = (127/2/12);
  return (val) => clipBipol(
    Math.log(2, val/freqMiddle)/(Math.LN2)/halfOctaves
  );
}();

module.exports = {
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
  freqBipol: freqBipol,
  bipolFreq: bipolFreq,
};