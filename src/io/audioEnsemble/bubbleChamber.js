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
    key: 'bubbleChamber|voice1bottom',
    label: "Octave",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|rate1',
    label: "Rate 1",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|density1',
    label: "Density 1",
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

  let voice1bottom = 0.0;
  let seq1 = 0;

  let basePitch = 0; // key
  let pitchIntervals = [0, 4, 7, 9]; // pitchIntervals above key

  let voice1counter = 0;
  let voice1timeMul = 4;
  let voice1delay = 0;
  let voice1smear = 0;
  let voice1scramble = 0;
  let voice1gain = 0;

  let step = "16n";
  let i = 0;

  let delay1 = new Tone.FeedbackDelay("8n", 0.0).toMaster();
  delay1.wet.rampTo(0.5, '1m');
  delay1.feedback.rampTo(0.5, '1m');
  let voice1  = new Tone.Sampler({
    "url" : "./sound/panflute_c4.mp3",
    "volume" : -10,
    "envelope" : {
      "attack" : 0.02,
      "decay" : 0.1,
      "sustain" : 0.5,
      "release" : 0.9,
    }
  });
  voice1.connect(delay1);

  const playVoice1Note = (time, value) => {
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

  let subSig = audio.actualControlValues.map(
    subSignal('bubbleChamber|')
  ).share();
  subSig.subscribe((sig) => {
    basePitch = bipolInt(0, 11, sig.pitch__0001  || 0.0);
    pitchIntervals[1] = bipolInt(3, 5, sig.pitch__0002 || 0.0);
    pitchIntervals[2] = bipolInt(7, 9, sig.pitch__0003 || 0.0);
    pitchIntervals[3] = bipolInt(10, 13, sig.pitch__0004 || 0.0);
    /*
    voice1timeMul = bipolLookup(
      [8, 6, 4, 3, 2, 1],
      sig.density1 || 0.0);
      */
    voice1bottom = bipolInt(40, 70, sig.voice1bottom || 0.0);
    voice1timeMul = bipolLookup(
      [16, 12, 10, 8, 6, 5, 4, 3, 2, 1],
      sig.rate1 || 0.0);
    voice1delay = bipolLookup(
      [16, 12, 10, 8, 6, 5, 4, 3, 2, 1],
      sig.delay1 || 0.0);
    voice1delay = bipolLin(
      0, 1,
      sig.smear1 || 0.0);
    voice1scramble = bipolInt(
      1, 32,
      sig.scramble1 || 0.0);
    voice1gain = bipolLin(
      -30.0, 0.0,
      sig.gain || 0.0);
  });

  let loop1 = new Tone.Loop(
    (time) => {
      i = (i + 1) % 64;
      console.debug('loop', time, i);
      if (i % voice1timeMul === 0) {
        note = nextNote(
          i,
          voice1bottom,
          pitchIntervals,
          voice1scramble,
          voice1timeMul);
        playVoice1Note(time, note)
      }
    },
    step
  ).start('1m');
  function nextNote(
    i,
    bottomNote,
    pitchIntervals,
    scramble,
    timeMul
  ) {
    let idx = (i + 17) * scramble % 3;
    return {
      dur: Tone.Time(step).mult(timeMul),
      note: Tone.Frequency(
        wrap(bottomNote, bottomNote+12, basePitch + pitchIntervals[i]),
        "midi",
      ),
    }
  }


  return {
  }
};
