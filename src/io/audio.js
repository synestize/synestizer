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
import { dbAmp, freqMidi, audioFreq } from '../lib/transform'
import {deviceSubject} from '../lib/av'

export default function init(store, signalio) {
  //hardware business
  let devinfo;
  let sourceDevices = new Map(); //id -> device
  let sourceDevice; //device
  let sinkDevices = new Map(); //id -> device
  let sinkDevice; //device
  let context;

  let sourceChannel;
  let sourceControls;
  let sinkChannel;
  let sinkControls;
  let validSource = false;
  let validSink = false;
  let storeStream = toObservable(store);

  function doAudioSinkPlumbing() {
    const key = store.getState().audio.sourceDevice;
    Rx.Observable.fromPromise(
      navigator.mediaDevices.getUserMedia({deviceId:key, audio: true})
    ).subscribe(initAudioContext);
  }
  //Create a context with master out volume
  //Don't yet understand how this will work for the microphone etc
  function initAudioContext(dev){
    if (context!==undefined) {
      context.close()
    }
    sourceDevice = dev;
    context = new window.AudioContext();
    window.audioContext = context;
    let compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 2;
    // compressor.reduction.value = 0; //should be negative for boosts?
    compressor.attack.value = 0.05;
    compressor.release.value = 0.3;
    compressor.connect(context.destination);
    let outputNode = context.createGain();
    outputNode.connect(compressor);
    return {
      context,
      outputNode
    }
  };

  //set up audio system
  function updateAudioIO(newdevinfo) {
    let sourceNames = new Map();
    let sinkNames = new Map();
    let state = store.getState();

    devinfo = newdevinfo;
    // console.debug('mediadevices', devinfo);

    let i=0;
    for (let dev of devinfo){
      let label = dev.label || ('device ' + i);
      if (dev.kind==='audioinput') {
        sourceNames.set(dev.deviceId, label)
        sourceDevices.set(dev.deviceId, dev)
      }
      else if (dev.kind==='audiooutput') {
        sinkNames.set(dev.deviceId, label)
        sourceDevices.set(dev.deviceId, dev)
      };
      i++;
    }
    store.dispatch(setAllAudioSourceDevices(sourceNames));
    store.dispatch(setAllAudioSinkDevices(sinkNames));

    if (sourceNames.has(state.audio.sourceDevice)) {
      store.dispatch(setValidAudioSourceDevice(true));
    } else {
      store.dispatch(setValidAudioSourceDevice(false));
    }
    if (sinkNames.has(state.audio.sinkDevice)) {
      store.dispatch(setValidAudioSinkDevice(true));
    } else {
      store.dispatch(setValidAudioSinkDevice(false));
    }
  };

  storeStream.pluck(
      'audio', 'sourceDevice'
    ).distinctUntilChanged().subscribe(doAudioSinkPlumbing)
  storeStream.pluck(
      '__volatile', 'audio', 'validSource'
    ).distinctUntilChanged().subscribe(
      (validity)=> {validSource = validity; doAudioSinkPlumbing()}
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
  deviceSubject.subscribe(updateAudioIO,
    (err) => console.debug(err.stack)
  );
  return {
    playNote: () => null
  }
};
