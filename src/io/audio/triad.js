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
    key: 'audio|triad|pitch-0001',
    name: "Pitch 1",
    ensemble: "Triad",
  }));
  return {
  }
};
