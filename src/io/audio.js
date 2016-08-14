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

  let sourceChannel;
  let sourceControls;
  let sinkChannel;
  let sinkControls;
  let validSource = false;
  let validSink = false;
  let storeStream = toObservable(store);

  function doAudioPlumbing(key) {
    sourceDevice = sourceDevices.get(key);

    Rx.Observable.fromPromise(
      navigator.mediaDevices.getUserMedia({deviceId:key, audio:true})
    ).subscribe(function(mediaStream) {
      //we can play the audio now, but we need to get audio metadata before the dimensions work etc, so we start from the onloaded event.
      Rx.Observable.fromEvent(
        audioElem, 'loadedmetadata').subscribe(pumpPixels);
      audioElem.src = window.URL.createObjectURL(mediaStream);
      audioElem.play();
    });
  }
  //Create a context with master out volume
  function initAudioContext(){
    let context = new window.AudioContext();
    let compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 2;
    compressor.reduction.value = 0; //should be negative for boosts?
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
      if (dev.kind==='audioinput') {
        sourceNames.set(dev.deviceId, dev.label || ('device ' + i))
      }
      else if (dev.kind==='audiooutput') {
        sinkNames.set(dev.deviceId, dev.label || ('device ' + i))
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

  // Now that the MIDI system is set up, plug this app in to it.
  function plugAudioIn() {
    const key = store.getState().audio.sourceDevice;
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
  deviceSubject.subscribe(updateAudioIO,
    (err) => console.debug(err.stack)
  );
  return {
    playNote: () => null
  }
};
