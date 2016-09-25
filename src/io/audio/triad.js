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

export default function init(store, signalio, audio) {
  /*
   *
   */
  const Tone = audio.tone
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
    key: 'triad|octave-bottom',
    label: "Bottom octave",
    ensemble: "Triad",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'triad|octave-range',
    label: "Range",
    ensemble: "Triad",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'triad|gate',
    label: "Gate",
    ensemble: "Triad",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'triad|rate',
    label: "Arp rate",
    ensemble: "Triad",
  }));
  store.dispatch(addAudioSinkControl({
    key: 'triad|retrigger',
    label: "Arp retrigger",
    ensemble: "Triad",
  }));

  let octaveBottom = 0.0;
  let octaveRange = 0.0;
  let offsets = [0, 5, 10];
  let gate = 0.25;
  let rate = 1;
  let retrigger = 1;

  let notes = [
    Tone.Frequency(60, "midi"),
    Tone.Frequency(65, "midi"),
    Tone.Frequency(70, "midi"),
  ];

  audio.actualControlValues.pluck('triad|pitch-0001').subscribe(
    (val)=>{
      offsets[0] = bipolInt(0, 12, val || 0.0);
      updateSeq();
    }
  );
  audio.actualControlValues.pluck('triad|pitch-0002').subscribe(
    (val)=>{
      offsets[1] = bipolInt(0, 12, val || 0.0);
      updateSeq();
    }
  );
  audio.actualControlValues.pluck('triad|pitch-0003').subscribe(
    (val)=>{
      offsets[2] = bipolInt(0, 12, val || 0.0);
      updateSeq();
    }
  );
  audio.actualControlValues.pluck('triad|octave-bottom').subscribe(
    (val)=>{
      octaveBottom = bipolInt(2, 7, val || 0.0);
    }
  );
  audio.actualControlValues.pluck('triad|octave-range').subscribe(
    (val)=>{
      octaveRange = (val || 0.0)
    }
  );
  audio.actualControlValues.pluck('triad|gate').subscribe(
    (val)=>{
      gate = Tone.Time(retrigger).mult(
        bipolEquiOctave(0.25, 4, val || 0.0)
      ).eval()
      console.debug('gate', gate)
    }
  );
  audio.actualControlValues.pluck('triad|retrigger').subscribe(
    (val)=>{
      retrigger = bipolLookup(
        ['16n', '8n', '4n', '2n', '1m', '2m', '4m'],
        val || 0.0)
      console.debug('retrigger', retrigger)
    }
  );
  audio.actualControlValues.pluck('triad|rate').subscribe(
    (val)=>{
      rate = Tone.Time(retrigger).mult(
        bipolEquiOctave(0.25, 1.0, val || 0.0)
      ).quantize('64n')
      console.debug('rate', rate.eval())
    }
  );

  function updateSeq() {
    let octaveHigh = bipolInt(octaveBottom+1, 9, octaveRange);
    notes.length = 3 * (octaveHigh - octaveBottom);
    for (let oct=octaveBottom; oct<octaveHigh; oct++) {
      for (let i=0; i<3; i++) {
        let j = oct * 3 + i;
        notes[j] = Tone.Frequency(oct * 12 + offsets[i], "midi")
      }
    }
  }
  let synth = new Tone.Synth();
  synth.toMaster();

  let pattern = new Tone.Pattern(function(time, note){
    synth.triggerAttackRelease(note, gate, time);
  }, notes);

  pattern.start(0);

  return {
  }
};
