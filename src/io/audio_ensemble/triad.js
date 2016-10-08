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
  store.dispatch(addAudioSinkControl({
    key: 'triad|pitch-0001',
    label: "Pitch 1",
    ensemble: "Triad",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'triad|pitch-0002',
    label: "Pitch 2",
    ensemble: "Triad",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'triad|pitch-0003',
    label: "Pitch 3",
    ensemble: "Triad",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'triad|bottom',
    label: "Octave",
    ensemble: "Triad",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'triad|gate',
    label: "Gate",
    ensemble: "Triad",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'triad|arprate',
    label: "Arp Rate",
    ensemble: "Triad",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'triad|retriggerinterval',
    label: "Interval",
    ensemble: "Triad",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'triad|gain',
    label: "Gain",
    ensemble: "Triad",
  }));

  let bottom = 0.0;
  let offsets = [0, 5, 10];
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
  toObservable(store).pluck('audio', 'triad', 'mute').subscribe((newMute)=>{
    // console.debug('triadmute', newMute)
    mute = newMute;
  });

  const masterLoop = new Tone.Loop(multiArpeggiate, "1m").start('+1m');

  audio.actualControlValues.pluck('triad|pitch-0001').subscribe(
    (val)=>{
      offsets[0] = bipolInt(0, 3, val || 0.0);
    }
  );
  audio.actualControlValues.pluck('triad|pitch-0002').subscribe(
    (val)=>{
      offsets[1] = bipolInt(4, 7, val || 0.0);
    }
  );
  audio.actualControlValues.pluck('triad|pitch-0003').subscribe(
    (val)=>{
      offsets[2] = bipolInt(8, 12, val || 0.0);
    }
  );
  audio.actualControlValues.pluck('triad|bottom').subscribe(
    (val)=>{
      bottom = bipolInt(40, 70, val || 0.0);
    }
  );
  audio.actualControlValues.pluck('triad|gate').subscribe(
    (val)=>{
      gateScale = bipolEquiOctave(0.25, 2.0, val || 0.0)
    }
  );
  audio.actualControlValues.pluck('triad|retriggerinterval').map(
    (val)=>bipolLookup(
      ['16n', '8n', '4n', '2n', '1m'],
      val || 0.0)
    ).distinctUntilChanged().subscribe(
      (val)=>{
        retriggerInterval = Tone.Time(val);
      }
  )
  audio.actualControlValues.pluck('triad|arprate').subscribe(
    (val)=>{
      noteInterval = Tone.Time(retriggerInterval).mult(
        bipolLin(0.5, 0.0, val || 0.0)
      )
    }
  );
  audio.actualControlValues.pluck('triad|gain').subscribe(
    (val)=>{
      gain = bipolLin(-30.0, 0.0, val || 0.0)
    }
  );

  return {
  }
};
