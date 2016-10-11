import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/share';

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

import {
  subSignal
} from '../../lib/signalMangle'

import Tone from 'tone/build/Tone.js'

export default function init(store, signalio, audio) {
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|pitch__0001',
    label: "I",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|pitch__0002',
    label: "II",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|pitch__0003',
    label: "III",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|pitch__0004',
    label: "IV",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|bottomNote1',
    label: "Octave",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|rate1',
    label: "Rate",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|density1',
    label: "Density",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|scramble1',
    label: "scramble",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|delay1',
    label: "Delay",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|smear1',
    label: "Smear",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|gain1',
    label: "Gain",
    ensemble: "Bubble Chamber",
  }));

  let mute = false;

  let bottomNote1 = 0.0;
  let seq1 = 0;

  let basePitch = 0; // key
  let intervals = [0, 4, 7, 9]; // intervals above key
  let voice1counter = 0;
  let step = "8n";

  function nextPitch(i, bottomNote, intervals, scramble) {
    return {
      time: Tone.Time(noteInterval).mult(i),
      note: Tone.Frequency(
        wrap(bottomNote1, bottomNote1+12, intervals[i]),
        "midi",
      ),
      step
    }
  }

  let loop1 = new Tone.Loop(
    (time) => {
      console.debug('loop', time, voice1counter);
      voice1counter = (voice1counter + 1) % 32;
    },
    step
  ).start('1m');

  let delay1 = new Tone.FeedbackDelay("8n", 0.0).toMaster();
  delay1.wet.rampTo(0.5, '1m');
  delay1.feedback.rampTo(0.5, '1m');
  let voice1  = new Tone.Sampler({
    "url" : "./sound/panflute_c4.mp3",
    "volume" : -10,
    "envelope" : {
      "attack" : 0.02,
      "decay" : 0.1,
      "sustain" : 0.2,
      "release" : 0.9,
    }
  });
  voice1.connect(delay1);

  const playNote1 = (time, value) => {
    voice1.triggerAttackRelease(
      value.note,
      value.dur,
      time);
  }

  toObservable(store).pluck(
    'audio',
    'bubbleChamber',
    'mute'
  ).subscribe((newMute)=>{
    mute = newMute;
  });

  const masterLoop = new Tone.Loop(multiArpeggiate, "1m").start('+1m');

  let subSig = audio.actualControlValues.map(
    subSignal('bubbleChamber|')
  ).share();
  subSig.subscribe((sig) => {
    basePitch = bipolInt(0, 11, sig.pitch__0001  || 0.0);
    intervals[1] = bipolInt(3, 5, sig.pitch__0002 || 0.0);
    intervals[2] = bipolInt(7, 9, sig.pitch__0003 || 0.0);
    intervals[3] = bipolInt(10, 13, sig.pitch__0004 || 0.0);
    bottomNote1 = bipolInt(40, 70, sig.bottomNote1 || 0.0);
  });
  subSig.pluck('rate').subscribe(
    (val)=>{
      gateScale = bipolEquiOctave(0.25, 2.0, val || 0.0)
    }
  );
  subSig.pluck('density').map(
    (val)=>bipolLookup(
      ['16n', '8n', '4n', '2n', '1m'],
      val || 0.0)
    ).distinctUntilChanged().subscribe(
      (val)=>{
        retriggerInterval = Tone.Time(val);
      }
  )
  subSig.pluck('scramble').subscribe(
    (val)=>{
      noteInterval = Tone.Time(retriggerInterval).mult(
        bipolLin(0.5, 0.0, val || 0.0)
      )
    }
  );
  subSig.pluck('gain').subscribe(
    (val)=>{
      gain = bipolLin(-30.0, 0.0, val || 0.0)
    }
  );
  return {
  }
};
