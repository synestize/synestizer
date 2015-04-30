var app = app || {};

app.presets = {
  default: {
  "triad":{
    "oscFreq1":440,
    "oscFreq3":440,
    "oscFreq2":440,
    "oscType3":"sine",
    "oscType2":"sine",
    "oscType1":"sine",
    "output":0.3
  },
  "minimal":{
    "ampAttack":0.0,
    "tempo":200,
    "ampDecay":0.2,
    "ampRelease":0.5,
    "output":0.0,
    "ampSustain":1.0
  },
  "sampler":{
    "ampAttack":0.0,
    "output":0.0,
    "ampSustain":0.25,
    "ampDecay":0.2,
    "ampRelease":0.0
  }
  }
};