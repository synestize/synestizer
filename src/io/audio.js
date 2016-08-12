import Rx from 'rxjs/Rx'
import  {
  setValidAudioSourceDevice,
  setAudioSourceDevice,
  setAllAudioSourceDevices,
  setValidAudioSinkDevice,
  setAudioSinkDevice,
  setAllAudioSinkDevices
} from '../actions/audio'
import { toObservable } from '../lib/rx_redux'
import { dbAmp, freqMidi, midiFreq } from '../lib/transform'

export default function init(store, signalio) {
  let rawAudioInSubscription = null;
  let midiinfo = null;
  //hardware business
  let sourceChannel;
  let sourceControls;
  let sinkChannel;
  let sinkControls;
  let validSource = false;
  let validSink = false;
  let storeStream = toObservable(store);

  //Create a context with master out volume
  function initAudio(){
    let context = _audioState.context = new window.AudioContext();
    let compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 2;
    compressor.reduction.value = 0; //should be negative for boosts?
    compressor.attack.value = 0.05;
    compressor.release.value = 0.3;
    compressor.connect(context.destination);
    let outputNode = _audioStateSubject.outputNode = context.createGain();
    outputNode.connect(compressor);
    return _audioState
  };

  //set up midi system
  function updateAudioIO(newmidiinfo) {
    let sourceNames = new Map();
    let sinkNames = new Map();
    let state = store.getState();

    midiinfo = newmidiinfo;

    for (let [key, val] of midiinfo.inputs.entries()){
      sourceNames.set(key, val.name)
    };
    store.dispatch(setAllAudioSourceDevices(sourceNames));
    for (let [key, val] of midiinfo.outputs.entries()){
      sinkNames.set(key, val.name)
    };
    store.dispatch(setAllAudioSinkDevices(sinkNames));
    if (sourceNames.has(state.midi.sourceDevice)) {
      store.dispatch(setAudioSourceDevice(state.midi.sourceDevice));
      store.dispatch(setValidAudioSourceDevice(true));
    } else {
      store.dispatch(setValidAudioSourceDevice(false));
    }
    if (sinkNames.has(state.midi.sinkDevice)) {
      store.dispatch(setAudioSinkDevice(state.midi.sinkDevice));
      store.dispatch(setValidAudioSinkDevice(true));
    } else {
      store.dispatch(setValidAudioSinkDevice(false));
    }
  };

  // Now that the MIDI system is set up, plug this app in to it.
  function plugAudioIn() {
    const key = store.getState().midi.sourceDevice;
  }

  storeStream.pluck(
      'audio', 'sourceDevice'
    ).distinctUntilChanged().subscribe(plugAudioIn)
  storeStream.pluck(
      '__volatile', 'audio', 'validSource'
    ).distinctUntilChanged().subscribe(
      (validity)=> {validSource = validity; plugAudioIn()}
  )
  storeStream.pluck(
      'audio', 'sourceChannel'
    ).distinctUntilChanged().subscribe(
      (x) => {sourceChannel = x;}
  )
  storeStream.pluck(
      '__volatile', 'audio', 'validSink'
    ).distinctUntilChanged().subscribe(
      (validity)=> {validSink = validity;}
  )
  storeStream.pluck(
      'audio', 'sinkChannel'
    ).distinctUntilChanged().subscribe(
      (x) => {sinkChannel = x;}
  )
  storeStream.pluck(
      'audio', 'sinkCCs'
    ).distinctUntilChanged().subscribe(
      (x) => {sinkControls = x}
  )
  Rx.Observable.fromPromise(
    navigator.requestMIDIAccess()
  ).subscribe(updateAudioIO,
    (err) => console.debug(err.stack)
  );
  return {
    playNote: () => null
  }
};
