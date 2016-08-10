// [-1,1] <- [-inf, inf]
export const saturate = Math.tanh;
// [-1,1] -> [-inf, inf]
export const desaturate = (val) => clipinf(Math.atanh(val));

export const identity = (x)=>x;

//put together a list of values copula-wise with unit weights
export const perturb = (vals) => saturate(vals.map(desaturate).reduce((a,b)=>(a+b)))

export const clip = (min, max, val) => (
  Math.min(
    Math.max(
      val,
      -min
    ), max
  )
);
//clips to [-1,1]
export const clip1 = (val) => (
  Math.min(
    Math.max(
      val,
      -1
    ), 1
  )
);
//clips to finite values; we want to do this because Inf*0=NaN
export const clipinf = (val) => (
  Math.min(
    Math.max(
      val,
      -Number.MAX_VALUE
    ), Number.MAX_VALUE
  )
);

// [min, max]->[-1,1]
export const linBipol = (min, max, val) => {
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
export const bipolLin = (min, max, val) => {
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
export const intBipol = (min, max, val) => {
  let range = max-min;
  let middle = (max+min)/2
  return Math.max(Math.min(
    (val-middle) * 2 / range,
  max), min);
};
//we do rounding for integers
export const bipolInt = (min, max, val) => {
  let range = max-min;
  let middle = (max+min)/2
  return Math.max(Math.min(
    Math.round(val*range*0.5 + middle),
  max), min);
};
export const clipBipol = (val) => (
  Math.min(
    Math.max(
      val,
      -1
    ), 1
  )
);
//[0,127]->[-1,1]
export const midiBipol = (val) => (val-63.5)/63.5;
//[-1,1]->[0,127]
//slightly different to ensure 127 is attainable
export const bipolMidi = (val) => (
  Math.max(Math.min(
    Math.round(val*63.5 + 63.5),
  127), 0)
);
//[0,100]->[-1,1]
export const percBipol = (val) => (
  Math.min(
    Math.max(
      (val-50)/50,
      -1
    ), 1
  )
);
//[-1,1]->[0,100]
//slightly different to ensure 127 is attainable
export const bipolPerc = (val) =>(
  Math.max(Math.min(
    Math.round(val*50+50),
  100), 0)
);
// 69 = 440Hz
export const midiFreq = (val) =>  (Math.pow(2, (val - 69)/12)*440)
export const freqMidi = (val) => (Math.log(val/440)/(Math.LN2) * 12)
export const dbAmp = (val) => (Math.pow(10, val/20))

// exponential map to full MIDI spectrum
// defined in a fancy way to correspond to MIDI frequency
// note these are self-invoking functions.
export const bipolFreqAll = function() {
  const freqMiddle = midiFreq(127/2);
  const halfOctaves = (127/2/12);
  return (val) => Math.pow(2, clipBipol(val) * halfOctaves)*freqMiddle;
}();

export const freqBipolAll = function (val) {
  const freqMiddle = midiFreq(127/2);
  const halfOctaves = (127/2/12);
  return (val) => clipBipol(
    Math.log(2, val/freqMiddle)/(Math.LN2)/halfOctaves
  );
}();

export const bipolEquiOctave = function(min, max, val) {
  let logmin = Math.log(min)/Math.LOG2;
  let logmax = Math.log(max)/Math.LOG2;
  return Math.pow(2, bipolLin(logmin, logmax));
}
