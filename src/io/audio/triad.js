import Rx from 'rxjs/Rx'
import  {
  addAudioSinkControl,
  addEnsemble
} from '../../actions/audio'
import { dbAmp, freqMidi, audioFreq } from '../../lib/transform'
export default function init(store, signalio, audio) {
  /*
   *
   */
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
  return {
  }
};
