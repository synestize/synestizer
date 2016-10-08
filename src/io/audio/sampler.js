import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
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
  return {
  }
};
