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
    key: 'bubbleChamber|shuffle1',
    label: "Shuffle",
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

  let bottomNote1 = 0.0;
  let seq1 = 0;

  let basePitch = 0; // key
  let intervals = [0, 4, 7, 9]; // intervals above key
  let retriggerInterval = Tone.Time('1m');
  let noteInterval = Tone.Time(retriggerInterval).mult(0.25);
  let gateScale = 0.5;
  let gain = 0.0;
  let arpy;
  let mute = false;

  function notes(bottom) {
    const notes = []
    let dur =  Tone.Time(retriggerInterval).mult(gateScale);
    for (let i=0; i<3; i++) {
      const note = {
        time: Tone.Time(noteInterval).mult(i),
        note: Tone.Frequency(
          wrap(bottomNote1, bottomNote1+12, intervals[i]),
          "midi",
        ),
        dur
      }
      notes[i] = note
    }
    return notes
  }

  let delay1 = new Tone.FeedbackDelay("8n", 0.0).toMaster();
  delay1.wet.rampTo(0.5, '1m');
  delay1.feedback.rampTo(0.5, '1m');
  let voice1  = new Tone.Sampler({
    "url" : "./audio/505/hh.mp3",
    "volume" : -10,
    "envelope" : {
      "attack" : 0.02,
      "decay" : 0.1,
      "sustain" : 0.2,
      "release" : 0.9,
    }
  });
  voice1.connect(delay1);

  const playNote = (time, value) => {
    voice1.triggerAttackRelease(
      value.note,
      value.dur,
      time);
  }

  const multiArpeggiate = (time) => {
    let seq = notes()
    let oldarpy;
    // console.debug('ma', time,
    //   Tone.Time(retriggerInterval).eval(),
    // )
    // for (let n of seq) {
    //   console.debug('n', n.time.eval(), n.dur.eval() )
    // }
    if (arpy!==undefined) {
      oldarpy = arpy;
      arpy = undefined;
      oldarpy.stop(time )
      oldarpy.dispose()
    }
    if (!mute) {
      arpy = new Tone.Part(playNote, seq)
      arpy.loopStart = 0
      arpy.loopEnd = Tone.Time(retriggerInterval)
      arpy.loop = true
      arpy.start(time)
    }
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
  subSig.pluck('shuffle').subscribe(
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
