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

export default function init(store, signalio, audio, midiio) {
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|pitch__0001',
    label: "Root",
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
    label: "Rate",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice1density',
    label: "Density",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice1scramble',
    label: "scramble",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice1delayScale',
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
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice2bottom',
    label: "Octave",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice2rate',
    label: "Rate",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice2density',
    label: "Density",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice2scramble',
    label: "Scramble",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice2delayScale',
    label: "Delay",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice2smear',
    label: "Smear",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice2gain',
    label: "Gain",
    ensemble: "Bubble Chamber",
  }));

  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|bassbottom',
    label: "Octave",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|basspitch',
    label: "Pitch",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|bassdetune',
    label: "Detune",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|basscutoff',
    label: "Cutoff",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|bassdistort',
    label: "Distort",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|bassrate',
    label: "Rate",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|bassgate',
    label: "Gate",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|bassdecay',
    label: "Decay",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|bassgain',
    label: "Gain",
    ensemble: "Bubble Chamber",
  }));

  let basePitch = 0; // key
  let pitchIntervals = [0, 4, 7, 9]; // pitchIntervals above key

  let step = "16n";


  let voice1idx = 0;
  let voice1bottom = 0.0;
  let voice1counter = 0;
  let voice1timeMul = 4;
  let voice1delayScale = 0;
  let voice1smear = 0;
  let voice1scramble = 0;
  let voice1gainLevel = 0;
  let voice1mute = false;

  let voice2idx = 0;
  let voice2bottom = 0.0;
  let voice2counter = 0;
  let voice2timeMul = 4;
  let voice2delayScale = 0;
  let voice2smear = 0;
  let voice2scramble = 0;
  let voice2gainLevel = 0;
  let voice2mute = false;

  let voice3mute = false;

  let bassIdx = 0;
  let bassBottom = 0.0;
  let bassCounter = 0;
  let bassGainLevel = 0;
  let bassmute = false;


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
  let voice1centerPitch = Tone.Frequency("C4").toMidi();
  voice1synth.connect(voice1delayNode);

  toObservable(store).pluck(
    'audio', 'bubbleChamber', 'voice1', 'mute'
  ).subscribe((val)=>{
    voice1mute = val;
  });

  const playVoice1Note = (time, value) => {
    midiio.playNote({
      pitch: value.note,
      chan: 0,
      dur: value.dur,
      time: time
    })
    voice1synth.triggerAttackRelease(
      value.note - voice1centerPitch,
      time,
      value.dur,
    );
  }

  let voice1loop = new Tone.Loop(
    (time) => {
      voice1idx = (voice1idx + 1) % 64;

      if (voice1idx % voice1timeMul === 0 && !voice1mute) {
        let note = nextNote(
          voice1idx/voice1timeMul,
          voice1bottom,
          pitchIntervals,
          voice1scramble,
          voice1timeMul);
        playVoice1Note(time, note)
      }
    },
    step
  ).start('1m');

  let voice2gainNode = new Tone.Gain(voice2gainLevel, 'db')
  let voice2delayNode = new Tone.FeedbackDelay("8n", 0.0);
  voice2delayNode.connect(voice2gainNode)
  voice2gainNode.toMaster();
  voice2delayNode.wet.rampTo(0.5, '4n');
  voice2delayNode.feedback.rampTo(0.5, '4n');
  let voice2synth  = new Tone.Sampler({
    "url" : "./sound/vibraphone_c3.mp3",
    "volume" : -10,
    "envelope" : {
      "attack" : 0.02,
      "decay" : 0.1,
      "sustain" : 0.5,
      "release" : 0.9,
    }
  });
  let voice2centerPitch = Tone.Frequency("C3").toMidi();
  voice2synth.connect(voice2delayNode);

  toObservable(store).pluck(
    'audio', 'bubbleChamber', 'voice2', 'mute'
  ).subscribe((val)=>{
    voice2mute = val;
  });


  const playVoice2Note = (time, value) => {
    midiio.playNote({
      pitch: value.note,
      chan: 1,
      dur: value.dur,
      time: time
    })
    voice2synth.triggerAttackRelease(
      value.note - voice2centerPitch,
      time,
      value.dur,
      );
  }

  let voice2loop = new Tone.Loop(
    (time) => {
      voice2idx = (voice2idx + 1) % 64;
      if (voice2idx % voice2timeMul === 0 && !voice2mute) {
        let note = nextNote(
          voice2idx/voice2timeMul,
          voice2bottom,
          pitchIntervals,
          voice2scramble,
          voice2timeMul);
        playVoice2Note(time, note)
      }
    },
    step
  ).start('1m');

  toObservable(store).pluck(
    'audio', 'bubbleChamber', 'voice3', 'mute'
  ).subscribe((val)=>{
    voice3mute = val;
  });
  toObservable(store).pluck(
    'audio', 'bubbleChamber', 'bass', 'mute'
  ).subscribe((val)=>{
    bassmute = val;
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

    voice1delayScale = bipolLookup(
      [16, 12, 10, 8, 6, 5, 4, 3, 2, 1],
      sig.voice1delayScale || 0.0);
    voice1smear = bipolLin(
      0, 0.95,
      sig.voice1smear || 0.0);
    voice1delayNode.wet.rampTo(voice1smear, '4n');
    voice1delayNode.feedback.rampTo(1-voice1smear, '4n');
    voice1scramble = bipolInt(
      1, 7,
      sig.voice1scramble || 0.0) * 2 + 1;
    voice1gainLevel = bipolLin(
      -30.0, 0.0,
      sig.voice1gain || 0.0);
    voice1gainNode.gain.rampTo(voice1gainLevel, 0.1)
    let voice1actualDelTime = Math.min(
      Tone.Time('16n').mult(
      voice1delayScale)
      .eval(),
      1)
    voice1delayNode.delayTime.rampTo(voice1actualDelTime, '4n');

    voice2timeMul = bipolLin(
      0.1, 1.0,
      sig.voice2density || 0.0);

    voice2bottom = bipolInt(40, 70, sig.voice2bottom || 0.0);
    voice2timeMul = bipolLookup(
      [16, 12, 10, 8, 6, 5, 4, 3, 2, 1],
      sig.voice2rate || 0.0);

    voice2delayScale = bipolLookup(
      [16, 12, 10, 8, 6, 5, 4, 3, 2, 1],
      sig.voice2delayScale || 0.0);
    voice2smear = bipolLin(
      0, 0.95,
      sig.voice2smear || 0.0);
    voice2delayNode.wet.rampTo(voice2smear, '4n');
    voice2delayNode.feedback.rampTo(1-voice2smear, '4n');
    voice2scramble = bipolInt(
      1, 7,
      sig.voice2scramble || 0.0) * 2 + 1;
    voice2gainLevel = bipolLin(
      -30.0, 0.0,
      sig.voice2gain || 0.0);
    voice2gainNode.gain.rampTo(voice2gainLevel, 0.1)
    let voice2actualDelTime = Math.min(
      Tone.Time('16n').mult(
        voice2delayScale
      ).eval(),
      1)
    voice2delayNode.delayTime.rampTo(voice2actualDelTime, '4n');

  });

  function nextNote(
    voice1idx,
    bottomNote,
    pitchIntervals,
    scramble,
    timeMul
  ) {
    let idx = (voice1idx + 17) * scramble % 4;
    return {
      dur: Tone.Time(step).mult(timeMul).eval(),
      note: wrap(bottomNote, bottomNote+12, basePitch + pitchIntervals[idx]),
    }
  }

  return {
  }
};
