import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
import { map } from 'rxjs/operator/map';
import { pluck } from 'rxjs/operator/pluck';
import { toObservable } from '../../lib/rx_redux'

import  {
  addAudioSinkControl,
} from '../../actions/audio'

import {
  bipolLin,
  bipolInt,
  bipolEquiOctave,
  bipolLookup
} from '../../lib/transform'

import {
  mod,
  wrap
} from '../../lib/math'

import Tone from 'tone/build/Tone.js'

export default function init(store, signalio, audio) {
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|pitch-0001',
    label: "Pitch 1",
    ensemble: "Bubble Chamber",
  }));

  let synth = new Tone.PolySynth(
    9, Tone.Synth
  ).toMaster();

  const playNote = (time, value) => {
    synth.triggerAttackRelease(
      value.note,
      value.dur,
      time);
  }

  return {
  }
};
