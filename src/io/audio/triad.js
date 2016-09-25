import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
import { map } from 'rxjs/operator/map';

import  {
  addAudioSinkControl,
  addEnsemble
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
  let octaveRange = 0.0;
  let offsets = [0, 5, 10];
  let retriggerInterval = Tone.Time('1m');
  let noteInterval = Tone.Time(retriggerInterval).mult(0.25);
  let gate = Tone.Time(retriggerInterval).mult(0.25);
  let gain = 0.0;
  let notes = [];

  function updateNotes() {
    for (let i=0; i<3; i++) {
      const note = {
        time: Tone.Time(noteInterval).mult(i).eval(),
        note: Tone.Frequency(
          wrap(bottom, bottom+12, offsets[i]),
          "midi"
        )
      }
      console.debug('note', i, note)
      notes[i] = note
    }
  }
  let synth = new Tone.PolySynth(
    9, Tone.Synth
  ).toMaster();

  const playNote = (time, value) => {
    console.debug('playNote', time, value, gate.eval())
    synth.triggerAttackRelease(
      value.note,
      gate,
      time);
  }
  const arpeggiate = (time, dummy, whatever) => {
    console.debug('arptime', time, dummy, whatever)
    if (value.note!==0) return
    synth.releaseAll(time)
    const strum = new Tone.Part(
      playNote,
      notes);
    strum.start(time)
  }

  updateNotes()
  
  const masterLoop = new Tone.Part(arpeggiate, [
    {time:0, note: 0},
    {time:1, note: 1},
    {time:2, note: 2},
    {time:1000, note: 1},
  ])
  masterLoop.stop(0)
  masterLoop.loopStart = 0
  masterLoop.loopEnd = retriggerInterval
  masterLoop.loop = true
  masterLoop.start('2m')

  audio.actualControlValues.pluck('triad|pitch-0001').subscribe(
    (val)=>{
      offsets[0] = bipolInt(0, 3, val || 0.0);
      updateNotes();
    }
  );
  audio.actualControlValues.pluck('triad|pitch-0002').subscribe(
    (val)=>{
      offsets[1] = bipolInt(4, 7, val || 0.0);
      updateNotes();
    }
  );
  audio.actualControlValues.pluck('triad|pitch-0003').subscribe(
    (val)=>{
      offsets[2] = bipolInt(8, 12, val || 0.0);
      updateNotes();
    }
  );
  audio.actualControlValues.pluck('triad|bottom').subscribe(
    (val)=>{
      bottom = bipolInt(40, 70, val || 0.0);
      updateNotes();
    }
  );
  audio.actualControlValues.pluck('triad|gate').subscribe(
    (val)=>{
      gate = Tone.Time(retriggerInterval).mult(
        bipolEquiOctave(0.25, 2.0, val || 0.0)
      )
      console.debug('gate', gate.eval())
    }
  );
  audio.actualControlValues.pluck('triad|retriggerinterval')::map(
    (val)=>bipolLookup(
      ['16n', '8n', '4n', '2n', '1m', '2m', '4m'],
      val || 0.0)
    )::distinctUntilChanged().subscribe(
      (val)=>{
        retriggerInterval = val;
        masterLoop.loopEnd = retriggerInterval
        console.debug('retriggerInterval', retriggerInterval)
      }
  )
  audio.actualControlValues.pluck('triad|arprate').subscribe(
    (val)=>{
      noteInterval = Tone.Time(retriggerInterval).mult(
        bipolEquiOctave(1.0, 0.125, val || 0.0)
      )
      updateNotes();
    }
  );
  audio.actualControlValues.pluck('triad|gain').subscribe(
    (val)=>{
      gain = bipolLin(-30.0, 0.0, val || 0.0)
      console.debug('gain', gain)
    }
  );

  return {
  }
};
