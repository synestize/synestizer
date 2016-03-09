'use strict';

var transform = require('../../lib/transform.js');

var synth = {
  controls: {
    "base-freq": "Base Frequency",
    "tempo-00": "Tempo",
    "tempo-01a-num": "Tempo Numerator 1",
    "tempo-01b-denom": "Tempo Denominator 1",
    "tempo-02a-num": "Tempo Numerator 2",
    "tempo-02b-denom": "Tempo Denominator 2",
    "tempo-03a-num": "Tempo Numerator 3",
    "tempo-03b-denom": "Tempo Denominator 3",
    "ratio-01a-num": "Frequency Numerator 1",
    "ratio-01b-denom": "Frequency Numerator 1",
    "ratio-02a-num": "Frequency Numerator 2",
    "ratio-02b-denom": "Frequency Numerator 2",
    "ratio-03a-num": "Frequency Numerator 3",
    "ratio-03b-denom": "Frequency Numerator 3",
  },
  transforms: {
    "base-freq": (val) => transform.bipolEquiOctave(220, 880, val),
    "tempo-00": (val) => transform.bipolEquiOctave(40, 160, val),
    "tempo-01a-num": (val) => transform.bipolInt(1, 12, val),
    "tempo-01b-denom": (val) => transform.bipolInt(1, 4, val),
    "tempo-02a-num": (val) => transform.bipolInt(1, 12, val),
    "tempo-02b-denom": (val) => transform.bipolInt(1, 4, val),
    "tempo-03a-num": (val) => transform.bipolInt(1, 12, val),
    "tempo-03b-denom": (val) => transform.bipolInt(1, 8, val),
    "ratio-01a-num": (val) => transform.bipolInt(1, 8, val),
    "ratio-01b-denom": (val) => transform.bipolInt(1, 8, val),
    "ratio-02a-num": (val) => transform.bipolInt(1, 8, val),
    "ratio-02b-denom": (val) => transform.bipolInt(1, 8, val),
    "ratio-03a-num": (val) => transform.bipolInt(1, 8, val),
    "ratio-03b-denom": (val) => transform.bipolInt(1, 8, val),
  },
};

module.exports = synth;