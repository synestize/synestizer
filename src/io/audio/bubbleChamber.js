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
    key: 'bubbleChamber|voice1pan',
    label: "Pan",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice1pattern',
    label: "Pattern",
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
    key: 'bubbleChamber|voice2pan',
    label: "Pan",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|voice2pattern',
    label: "Pattern",
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
    key: 'bubbleChamber|bassdensity',
    label: "Density",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|basspattern',
    label: "Pattern",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|bassspread',
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
    key: 'bubbleChamber|bassovertones',
    label: "Overtones",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|bassslide',
    label: "Slide",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|bassrate',
    label: "Rate",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|bassattack',
    label: "Attack",
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
  let voice1pattern = 0;
  let voice1gainLevel = 0;
  let voice1mute = false;
  let voice1sampleKey = 'panflute';
  let voice1centerPitch = 60;
  let voice1density = 1.0;

  let voice1gainNode = new Tone.Gain(voice1gainLevel, 'db')
  let voice1delayNode = new Tone.FeedbackDelay("8n", 0.0);
  let voice1meterNode = new Tone.Meter("level");
  let voice1pannerNode = new Tone.Panner(0);
  let voice1panSignal = new Tone.Signal(0);
  voice1panSignal.connect(voice1pannerNode.pan)

  voice1delayNode.connect(voice1pannerNode)
  voice1pannerNode.connect(voice1gainNode)
  voice1gainNode.connect(voice1meterNode).toMaster();
  voice1delayNode.wet.rampTo(0.5, '4n');
  voice1delayNode.feedback.rampTo(0.5, '4n');
  let voice1synth  = new Tone.Sampler({
    'url': audio.buffers.get(voice1sampleKey),
    "volume" : -10,
    "envelope" : {
      "attack" : 0.02,
      "decay" : 0.1,
      "sustain" : 0.5,
      "release" : 0.9,
    }
  });

  toObservable(store).pluck(
    'audio', 'bubbleChamber', 'voice1', 'sample'
  ).distinctUntilChanged().subscribe((val)=>{
    voice1sampleKey = val || voice1sampleKey;
    // console.debug('voice1sampleKey', voice1sampleKey, val);
    voice1synth.player.buffer = audio.buffers.get(voice1sampleKey);
    voice1centerPitch = Tone.Frequency(
      audio.bufferMeta[voice1sampleKey].root
    ).toMidi();
  });
  voice1synth.connect(voice1delayNode);

  toObservable(store).pluck(
    'audio', 'bubbleChamber', 'voice1', 'mute'
  ).subscribe((val)=>{
    voice1mute = val;
  });

  const playVoice1Note = (time, value) => {
    try {
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
    } catch (e) {
      console.warn(e)
    }
  }

  let voice1loop = new Tone.Loop(
    (time) => {
      voice1idx = (voice1idx + 1) % 64;

      if (voice1idx % voice1timeMul === 0 && !voice1mute) {
        let note = nextNote(
          voice1idx/voice1timeMul,
          voice1bottom,
          pitchIntervals,
          voice1pattern,
          voice1timeMul,
          voice1density);
        // console.debug('note', note)
        if (note) playVoice1Note(time, note)
      }
    },
    step
  ).start('1m');

  let voice2idx = 0;
  let voice2bottom = 0.0;
  let voice2counter = 0;
  let voice2timeMul = 4;
  let voice2delayScale = 0;
  let voice2smear = 0;
  let voice2pattern = 0;
  let voice2gainLevel = 0;
  let voice2mute = false;
  let voice2sampleKey = 'vibraphone';
  let voice2centerPitch = 60;
  let voice2density = 1.0;

  let voice2gainNode = new Tone.Gain(voice2gainLevel, 'db')
  let voice2delayNode = new Tone.FeedbackDelay("8n", 0.0);
  let voice2meterNode = new Tone.Meter("level");
  let voice2pannerNode = new Tone.Panner(0);
  let voice2panSignal = new Tone.Signal(0);
  voice2panSignal.connect(voice2pannerNode.pan)

  voice2delayNode.connect(voice2pannerNode)
  voice2pannerNode.connect(voice2gainNode)
  voice2gainNode.connect(voice2meterNode).toMaster();
  voice2delayNode.wet.rampTo(0.5, '4n');
  voice2delayNode.feedback.rampTo(0.5, '4n');
  let voice2synth  = new Tone.Sampler({
    'url': audio.buffers.get(voice2sampleKey),
    "volume" : -10,
    "envelope" : {
      "attack" : 0.02,
      "decay" : 0.1,
      "sustain" : 0.5,
      "release" : 0.9,
    }
  });

  toObservable(store).pluck(
    'audio', 'bubbleChamber', 'voice2', 'sample'
  ).distinctUntilChanged().subscribe((val)=>{
    voice2sampleKey = val || voice2sampleKey;
    // console.debug('voice2sampleKey', voice2sampleKey, val);
    voice2synth.player.buffer = audio.buffers.get(voice2sampleKey);
    voice2centerPitch = Tone.Frequency(
      audio.bufferMeta[voice2sampleKey].root
    ).toMidi();
  });
  voice2synth.connect(voice2delayNode);

  toObservable(store).pluck(
    'audio', 'bubbleChamber', 'voice2', 'mute'
  ).subscribe((val)=>{
    voice2mute = val;
  });

  const playVoice2Note = (time, value) => {
    try {
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
    } catch (e) {
      console.warn(e)
    }

  }

  let voice2loop = new Tone.Loop(
    (time) => {
      voice2idx = (voice2idx + 1) % 64;

      if (voice2idx % voice2timeMul === 0 && !voice2mute) {
        let note = nextNote(
          voice2idx/voice2timeMul,
          voice2bottom,
          pitchIntervals,
          voice2pattern,
          voice2timeMul,
          voice2density);
        // console.debug('note', note)
        if (note) playVoice2Note(time, note)
      }
    },
    step
  ).start('1m');

  toObservable(store).pluck(
    'audio', 'bubbleChamber', 'voice3', 'mute'
  ).subscribe((val)=>{
    voice3mute = val;
  });

  let voice3mute = false;

  let bassidx = 0;
  let bassbottom = 40;
  let basspitchidx = 0;
  let basscounter = 0;
  let basstimeMul = 4;
  let bassgainLevel = -10;
  let bassmute = false;
  let bassdensity = 1.0;
  let bassspread = 0.0;
  let bassdistort = 0;
  let bassovertones = 0
  let basswidth = 0.5;
  let bassattack = 0.05;
  let bassdecay = 0.15;
  let bassrelease = 0.5;
  let basspattern = 5;  //controls patters of triggers
  let basspitch = 50;
  let basscutoffHeadroom = 2;
  let bassgainNode = new Tone.Gain(bassgainLevel, 'db');
  let bassFreqNode = new Tone.Signal(100);
  let bassmeterNode = new Tone.Meter("level");
  let basson = false;

  bassgainNode.connect(bassmeterNode).toMaster();
  let basssynth  = new Tone.MonoSynth({
    oscillator: {
      'type': 'pulse',
    },
    filterEnvelope : {
      Q: 3,
      sustain: 1,
    },
    envelope : {
      "attack" : 0.02,
      "decay" : 0.1,
      "sustain" : 0.5,
      "release" : 0.9,
    }
  });

  basssynth.connect(bassgainNode);

  toObservable(store).pluck(
    'audio', 'bubbleChamber', 'bass', 'mute'
  ).subscribe((val)=>{
    bassmute = val;
  });


  let bassloop = new Tone.Loop(
    (time) => {
      bassidx = (bassidx + 1) % 64;
      if (bassidx % basstimeMul === 0) {
        // this might get weird if we run TOO early triggering
        let nextbasson = false;
        if (!bassmute) {
          let denseVal = ((bassidx + 23) * (11+basspattern) % 17)/17 + 1/34;
          nextbasson = denseVal<=bassdensity;
          // console.debug('bassdenseVal', bassdensity, denseVal, basson, nextbasson, basstimeMul, basspattern);
        }
        try {
          if (nextbasson && !basson) {
            basssynth.triggerAttack(basspitch, time)
            // console.debug('bassonset', basspitch);

          } else if (!nextbasson) {
            basssynth.triggerRelease(time)
            // console.debug('bassoffset', basspitch);
          }
          basson = nextbasson
        } catch (e) {
          console.warn(e)
        }

      }
    },
    step
  ).start('1m');

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

    voice1bottom = bipolInt(28, 70, sig.voice1bottom || 0.0);
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
    voice1panSignal.rampTo(sig.voice1pan || 0.0, '1n');
    voice1pattern = bipolInt(
      1, 7,
      sig.voice1pattern || 0.0) * 2 + 1;
    voice1density = bipolLin(
      0, 1,
      sig.voice1density || 0.0);
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

    voice2bottom = bipolInt(28, 70, sig.voice2bottom || 0.0);
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
    voice2panSignal.rampTo(sig.voice2pan || 0.0, '1n');
    voice2pattern = bipolInt(
      1, 7,
      sig.voice2pattern || 0.0) * 2 + 1;
    voice2density = bipolLin(
      0, 1,
      sig.voice2density || 0.0);
    voice2gainLevel = bipolLin(
      -30.0, 0.0,
      sig.voice2gain || 0.0);
    voice2gainNode.gain.rampTo(voice2gainLevel, 0.1)
    let voice2actualDelTime = Math.min(
      Tone.Time('16n').mult(
      voice2delayScale)
      .eval(),
      1)
    voice2delayNode.delayTime.rampTo(voice2actualDelTime, '4n');

    bassbottom = bipolInt(16, 58, sig.bassbottom || 0.0);
    basspitchidx =  bipolInt(
      0, 3,
      sig.basspitch|| 0.0);
    basspitch = wrap(bassbottom, bassbottom+12,
      basePitch + pitchIntervals[basspitchidx]);
    basssynth.setNote(basspitch);
    basssynth.filterEnvelope.baseFrequency = basspitch;
    basssynth.portamento =  bipolLin(
      0, 1.0,
      sig.bassslide|| 0.0);
    bassspread = sig.bassspread;
    basscutoffHeadroom = bipolLin(
      0.0, 1,
      sig.basscutoff || 0.0);
    basssynth.filterEnvelope.sustain = basscutoffHeadroom;
    bassdistort = bipolLin(
      0.01, 0.5,
      sig.bassdistort || 0.0);
    basssynth.oscillator.width.rampTo(bassdistort, '8n');
    bassovertones = bipolEquiOctave(
      0.001, 0.1,
      sig.bassovertones || 0.0);
    bassattack = bipolEquiOctave(
      0.001, 0.1,
      sig.bassattack || 0.0);
    bassrelease = bipolEquiOctave(
      0.01, 1.0,
      sig.bassrelease || 0.0);
    bassdecay = Math.exp((
      Math.log(bassattack) + Math.log(bassrelease)
    )/2.0);
    basssynth.envelope.attack = bassattack;
    basssynth.envelope.decay = bassdecay;
    basssynth.envelope.release = bassrelease;
    basssynth.filterEnvelope.attack = bassattack;
    basssynth.filterEnvelope.decay = bassdecay;
    basssynth.filterEnvelope.release = bassrelease;

    bassgainLevel = bipolLin(
      -30.0, 0.0,
      sig.bassgain || 0.0);
    basstimeMul = bipolLookup(
      [16, 12, 10, 8, 6, 5, 4, 3, 2, 1],
      sig.bassrate || 0.0);
    bassdensity = bipolLin(
      0, 1,
      sig.bassdensity || 0.0);
    bassgainLevel = bipolLin(
      -30.0, 0.0,
      sig.bassgain || 0.0);
    bassgainNode.gain.rampTo(bassgainLevel, 0.1)

  });

  function nextNote(
    voiceidx,
    bottomNote,
    pitchIntervals,
    scramble,
    timeMul,
    density=1.0
  ) {
    let denseVal = ((voiceidx + 23) * (11+scramble) % 17)/17+ 1/34;
    // console.debug('denseVal', density, denseVal);
    if (denseVal<=density) {
      let pitchIdx = (voiceidx + 17) * scramble % 4;
      return {
        dur: Tone.Time(step).mult(timeMul).eval(),
        note: wrap(bottomNote, bottomNote+12,
          basePitch + pitchIntervals[pitchIdx]),
      }
    } else {
      return false
    }
  }

  return {
  }
};
