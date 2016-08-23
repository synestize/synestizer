import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';

import  {
  setValidAudioSourceDevice,
  setAudioSourceDevice,
  setAllAudioSourceDevices,
  setValidAudioSinkDevice,
  setAudioSinkDevice,
  setAllAudioSinkDevices,
  publishAudioSinkSignal,
  unpublishAudioSinkSignal
} from '../actions/audio'
import { toObservable } from '../lib/rx_redux'
import { dbAmp, freqMidi, audioFreq } from '../lib/transform'
import { deviceSubject } from '../lib/av'
import { audioSinkStreamName } from './audio/util'
import triad_ from './audio/triad'

export default function init(store, signalio) {
  //hardware business
  let devinfo;
  let sourceDevices = new Map(); //id -> device
  let sourceDevice; //device
  let sinkDevices = new Map(); //id -> device
  let sinkDevice; //device
  let context;

  let sourceControls;
  let sinkControls;
  let validSource = false;
  let validSink = false;
  let storeStream = toObservable(store);

  let actualControlValueStream = new BehaviorSubject(
    store.getState().audio.sinkControlBias
  );
  let ensembles = {}

  const audioInfrastructure = {
    actualControlValueStream,
    ensembles
  }

  function doAudioSinkPlumbing() {
    const key = store.getState().audio.sourceDevice;
    Observable::fromPromise(
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

    Object.assign(audioInfrastructure, {
      context,
      outputNode,
    })
    ensembles.triad = triad_(store, signalio, audioInfrastructure)
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
  ).distinctUntilChanged().subscribe(
    doAudioSinkPlumbing
  )
  storeStream.pluck(
    '__volatile', 'audio', 'validSource'
  ).distinctUntilChanged().subscribe(
    (validity)=> {validSource = validity; doAudioSinkPlumbing()}
  )
  storeStream.pluck(
    '__volatile', 'audio', 'validSink'
  ).distinctUntilChanged().subscribe(
    (validity)=> {validSink = validity;}
  )
  storeStream.pluck(
    'audio', 'sinkControls'
  ).distinctUntilChanged().subscribe(
      (x) => {sinkControls = x}
  )
  storeStream.pluck(
    'audio', 'nSinkControlSignals'
  ).distinctUntilChanged().subscribe(
    (n) => {
      const currN = Object.keys(
        store.getState().signal.sinkSignalMeta
      ).filter((k)=>(k.startsWith('audio-'))).length
      // console.debug(
      //   'nsinkb', currN, n)
      if (currN<n) {
        // console.debug(
        //   'nsinkc', 'too few')
        for (let i=currN; i<n; i++) {
          // console.debug(publishAudioSinkSignal(i))
          store.dispatch(publishAudioSinkSignal(i))
        }
      } else if (currN>n) {
        // console.debug(
        //   'nsinkc', 'too many')
        for (let i=n; i<currN; i++) {
          // console.debug(unpublishAudioSinkSignal(i))
          store.dispatch(unpublishAudioSinkSignal(i))
        }
      }
    }
  )
  deviceSubject.subscribe(updateAudioIO,
    (err) => console.debug(err.stack)
  );
  return audioInfrastructure
};
