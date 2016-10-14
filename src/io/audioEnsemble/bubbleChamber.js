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
    key: 'bubbleChamber|voice1rate',
    label: "Rate 1",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice1density',
    label: "Density 1",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice1scramble',
    label: "scramble",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice1delayTime',
    label: "Delay",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice1smear',
    label: "Smear",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice1gain',
    label: "Gain",
    ensemble: "Bubble Chamber",
  }));


  let voice1bottom = 0.0;
  let seq1 = 0;

  let basePitch = 0; // key
  let pitchIntervals = [0, 4, 7, 9]; // pitchIntervals above key

  let voice1counter = 0;
  let voice1timeMul = 4;
  let voice1delayTime = 0;
  let voice1smear = 0;
  let voice1scramble = 0;
  let voice1gainLevel = 0;
  let voice1basePitch = Tone.Frequency("C4").toMidi();
  let voice1mute = false;

  let step = "16n";
  let i = 0;

  let voice1gainNode = new Tone.Gain(voice1gainLevel, 'db')
  let voice1delayNode = new Tone.FeedbackDelay("8n", 0.0);
  voice1delayNode.connect(voice1gainNode)
  voice1gainNode.toMaster();
  voice1delayNode.wet.rampTo(0.5, '4n');
  voice1delayNode.feedback.rampTo(0.5, '4n');
  let voice1synth  = new Tone.Sampler({
    "url" : "./sound/panflute_c4.mp3",
    "volume" : -10,
    "envelope" : {
      "attack" : 0.02,
      "decay" : 0.1,
      "sustain" : 0.5,
      "release" : 0.9,
    }
  });
  voice1synth.connect(voice1delayNode);

  toObservable(store).pluck(
    'audio', 'bubbleChamber', 'voice1mute'
  ).subscribe((val)=>{
    // console.debug('triadmute', newMute)
    voice1mute = val;
  });

  const playVoice1Note = (time, value) => {
    voice1synth.triggerAttackRelease(
      value.note - voice1basePitch,
      time,
      value.dur,
      );
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
    pitchIntervals[1] = bipolInt(2, 6, sig.pitch__0002 || 0.0);
    pitchIntervals[2] = bipolInt(6, 10, sig.pitch__0003 || 0.0);
    pitchIntervals[3] = bipolInt(9, 13, sig.pitch__0004 || 0.0);
    voice1timeMul = bipolLin(
      0.1, 1.0,
      sig.voice1density || 0.0);

    voice1bottom = bipolInt(40, 70, sig.voice1bottom || 0.0);
    voice1timeMul = bipolLookup(
      [16, 12, 10, 8, 6, 5, 4, 3, 2, 1],
      sig.voice1rate || 0.0);
    // console.debug('voice1rate', sig.voice1rate, voice1timeMul)

    voice1delayTime = bipolLookup(
      [16, 12, 10, 8, 6, 5, 4, 3, 2, 1],
      sig.voice1delayTime || 0.0);
    voice1smear = bipolLin(
      0, 0.95,
      sig.voice1smear || 0.0);
    voice1scramble = bipolInt(
      1, 7,
      sig.voice1scramble || 0.0) * 2 + 1;
    voice1gainLevel = bipolLin(
      -30.0, 0.0,
      sig.voice1gain || 0.0);
    voice1gainNode.gain.rampTo(voice1gainLevel, 0.1)
    voice1delayNode.wet.rampTo(voice1smear, '4n');
    voice1delayNode.feedback.rampTo(1-voice1smear, '4n');
    let actualdel = Tone.Time('16n').mult(voice1delayTime).eval()
    voice1delayNode.delayTime.rampTo(actualdel, actualdel);
  });

  let loop1 = new Tone.Loop(
    (time) => {
      i = (i + 1) % 64;
      // console.debug('loop', time, i);
      if (i % voice1timeMul === 0) {
        let note = nextNote(
          i/voice1timeMul,
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
    // console.debug('inner', i, scramble, idx, pitchIntervals[idx])
    return {
      dur: Tone.Time(step).mult(timeMul).eval(),
      note: wrap(bottomNote, bottomNote+12, basePitch + pitchIntervals[idx]),
    }
  }

  return {
  }
};
