import Rx from 'rxjs/Rx'
import  {
  addAudioSinkControl,
  addEnsemble
} from '../../actions/audio'

import { dbAmp, freqMidi, audioFreq, bipolLin } from '../../lib/transform'
export default function init(store, signalio, audio) {
  /*
   *
   */
  const Tone = audio.tone
  console.debug('traidaudio', audio)

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

  let notes = [
    Tone.Frequency(69, "midi"),
    Tone.Frequency(71, "midi"),
  ]

  audio.actualControlValues.pluck('triad|pitch-0001').subscribe(
    (val)=>{
      notes[0]= Tone.Frequency(bipolLin(69, 75, val), "midi")
    }
  )
  audio.actualControlValues.pluck('triad|pitch-0002').subscribe(
    (val)=>{
      notes[1]= Tone.Frequency(bipolLin(69, 75, val), "midi")
    }
  )

  let synth = new Tone.Synth();
  synth.toMaster();

  let pattern = new Tone.Pattern(function(time, note){
    synth.triggerAttackRelease(note, 0.25, time);
  }, notes);

  pattern.start(0);

  return {
  }
};
