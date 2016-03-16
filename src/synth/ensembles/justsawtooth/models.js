'use strict';

var transform = require('../../../lib/transform.js');

var controls = {
    "00-base-freq": {
      label: "Base Frequency",
      transform: (val) => transform.bipolEquiOctave(220, 880, val),
    },
    "00-base-tempo": {
      label: "Tempo",
      transform: (val) => transform.bipolEquiOctave(40, 160, val),
    },
    "tempo-01a-num": {
      label: "Tempo Numerator 1",
      transform: (val) => transform.bipolInt(1, 12, val),
    },
    "tempo-01b-denom": {
      label: "Tempo Denominator 1",
      transform: (val) => transform.bipolInt(1, 4, val),
    },
    "freq-01a-num": {
      label: "Frequency Numerator 1",
      transform: (val) => transform.bipolInt(1, 8, val),
    },
    "freq-01b-denom": {
      label: "Frequency Denominator 1",
      transform: (val) => transform.bipolInt(1, 8, val),
    },
    "tempo-01a-num": {
      label: "Tempo Numerator 1",
      transform: (val) => transform.bipolInt(1, 12, val),
    },
    "tempo-02b-denom": {
      label: "Tempo Denominator 2",
      transform: (val) => transform.bipolInt(1, 4, val),
    },
    "freq-02a-num": {
      label: "Frequency Numerator 2",
      transform: (val) => transform.bipolInt(1, 8, val),
    },
    "freq-02b-denom": {
      label: "Frequency Denominator 2",
      transform: (val) => transform.bipolInt(1, 8, val),
    },
    "tempo-02a-num": {
      label: "Tempo Numerator 3",
      transform: (val) => transform.bipolInt(1, 12, val),
    },
    "tempo-03b-denom": {
      label: "Tempo Denominator 3",
      transform: (val) => transform.bipolInt(1, 4, val),
    },
    "freq-03a-num": {
      label: "Frequency Numerator 3",
      transform: (val) => transform.bipolInt(1, 8, val),
    },
    "freq-03b-denom": {
      label: "Frequency Denominator 3",
      transform: (val) => transform.bipolInt(1, 8, val),
    },
};


module.exports = Ensemble;