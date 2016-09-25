/*
 * various mathematical transforms,
 * mostly to do with getting values in the [-1,1] range
 * transformed into musical units
 */

// if our values are mostly 7 bits, e.g. MIDI,
// this is a good scale factor
const sevenBitSafe = 127.5/128
// If we are using 7 bits, we need to clip to a safe range
// This comes to [-3.13, 3.13]
const maxSafe = Math.atanh(
  1.0 * sevenBitSafe
) / sevenBitSafe

// [-inf, inf] -> [-1,1]
export const saturate = (val) => Math.tanh(
  val / sevenBitSafe
) * sevenBitSafe;

// [-1,1] <- [-inf, inf]
export const desaturate = (val) => clipinf(
  Math.atanh(
    val * sevenBitSafe
  ) / sevenBitSafe
);

export const identity = (x)=>x;

//put together a list of values copula-wise with unit weights
export const perturb = (vals) => saturate(
  vals.map(desaturate).reduce((a,b)=>(a+b))
)

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
      -maxSafe
    ), maxSafe
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
  return Math.max(
    Math.min(
      (val-middle) * 2 / range,
      max
    ), min);
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
//slightly different to ensure 100 is attainable
export const bipolPerc = (val) =>(
  Math.max(Math.min(
    Math.round(val*50+50),
  100), 0)
);

  export const bipolEquiOctave = function(min, max, val) {
  const logmin = Math.log(min)/(Math.LN2);
  const logmax = Math.log(max)/(Math.LN2);
  return Math.pow(2, bipolLin(logmin, logmax, val));
}
