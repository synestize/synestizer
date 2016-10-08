import 'rxjs/add/distinctUntilChanged';
import 'rxjs/add/map';
import 'rxjs/add/pluck';
import 'rxjs/add/share';
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
    key: 'bubbleChamber|pitch-0001',
    label: "I",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|pitch-0002',
    label: "II",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|pitch-0003',
    label: "III",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|pitch-0004',
    label: "IV",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|bottom',
    label: "Octave",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|rate',
    label: "Rate",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|density',
    label: "Density",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|shuffle',
    label: "Shuffle",
    ensemble: "Bubble Chamber",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'bubbleChamber|gain',
    label: "Gain",
    ensemble: "Bubble Chamber",
  }));

  let bottom = 0.0;
  let offsets = [0, 4, 7, undefined];
  let retriggerInterval = Tone.Time('1m');
  let noteInterval = Tone.Time(retriggerInterval).mult(0.25);
  let gateScale = 0.5;
  let gain = 0.0;
  let arpy;
  let mute = false;

  function notes() {
    const notes = []
    let dur =  Tone.Time(retriggerInterval).mult(gateScale);
    for (let i=0; i<3; i++) {
      const note = {
        time: Tone.Time(noteInterval).mult(i),
        note: Tone.Frequency(
          wrap(bottom, bottom+12, offsets[i]),
          "midi",
        ),
        dur
      }
      notes[i] = note
    }
    return notes
  }

  let synth = new Tone.PolySynth(
    9, Tone.Synth
  ).toMaster();

  const playNote = (time, value) => {
    synth.triggerAttackRelease(
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
    // console.debug('triadmute', newMute)
    mute = newMute;
  });

  const masterLoop = new Tone.Loop(multiArpeggiate, "1m").start('+1m');

  let subSig = audio.actualControlValues.map(
    subSignal('bubbleChamber|')
  ).share().subscribe((sig)=>{
    console.debug('sig', sig);
  })
  subSig.pluck('pitch-0001').subscribe(
    (val)=>{
      console.debug('pitch-0001', val, offsets[0]);
      offsets[0] = bipolInt(0, 11, val || 0.0);
    }
  );
  /*
  subSig.pluck('pitch-0002').subscribe(
    (val)=>{
      offsets[1] = bipolInt(3, 5, val || 0.0);
      console.debug('pitch-0002', val, offsets[1]);
    }
  );
  subSig.pluck('pitch-0003').subscribe(
    (val)=>{
      offsets[2] = bipolInt(7, 9, val || 0.0);
    }
  );
  subSig.pluck('pitch-0004').subscribe(
    (val)=>{
      offsets[2] = bipolInt(10, 13, val || 0.0);
    }
  );
  subSig.pluck('bottom').subscribe(
    (val)=>{
      bottom = bipolInt(40, 70, val || 0.0);
    }
  );
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
  */
  return {
  }
};
