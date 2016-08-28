import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { share } from 'rxjs/operator/share';
import { saturate, desaturate } from '../lib/transform.js'
import { setAllAudioSinkControlActualValues } from '../actions/audio';
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

  function doAudioSinkDevicePlumbing() {
    const key = store.getState().audio.sinkDevice;
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

  function calcAudioControls(sinkControls, signalState) {
    const actualSinkControlValues = {}
    // console.debug('calcAudioControls', sinkControls, signalState);
    for (let controlKey in sinkControls) {
      let controlMeta = sinkControls[controlKey];
      // console.debug('nu', controlKey, controlMeta)
      actualSinkControlValues[controlKey] = saturate(
        desaturate(controlMeta.bias || 0.0) +
        (
          (controlMeta.scale || 0.0) *
          desaturate(signalState[controlMeta.signal] || 0.0)
        )
      )
      // console.debug('mu', actualSinkControlValues[controlKey])
    }
    return actualSinkControlValues;
  }

  storeStream.pluck(
    'audio', 'sinkDevice'
  ).distinctUntilChanged().subscribe(
    doAudioSinkDevicePlumbing
  )
  storeStream.pluck(
    '__volatile', 'audio', 'validSource'
  ).distinctUntilChanged().subscribe(
    (validity)=> {validSource = validity; doAudioSinkDevicePlumbing()}
  )
  storeStream.pluck(
    '__volatile', 'audio', 'validSink'
  ).distinctUntilChanged().subscribe(
    (validity)=> {validSink = validity;}
  )
  storeStream.pluck(
    'audio', 'nSinkControlSignals'
  ).distinctUntilChanged().subscribe(
    (n) => {
      let sinkSignalMeta = store.getState().signal.sinkSignalMeta;
      const currN = Object.keys(
        sinkSignalMeta
      ).filter((k)=>(sinkSignalMeta[k].owner==="Audio")).length;
      // console.debug('signalpub', n, currN)
      if (currN<n) {
        for (let i=currN; i<n; i++) {
          // console.debug('signaladd', i)
          store.dispatch(publishAudioSinkSignal(i))
        }
      } else if (currN>n) {
        for (let i=n; i<currN; i++) {
          // console.debug('signaldel', i)
          store.dispatch(unpublishAudioSinkSignal(i))
        }
      }
    }
  )
  deviceSubject.subscribe(updateAudioIO,
    (err) => console.debug(err.stack)
  );
  Observable::combineLatest(
    storeStream.pluck(
      'audio', 'sinkControls'
    ).distinctUntilChanged(),
    signalio.sinkStateSubject,
    calcAudioControls
  ).subscribe(
      (val) => {
        actualControlValueStream.next(val)
      }
    );
  actualControlValueStream.subscribe(setAllAudioSinkControlActualValues)
  return audioInfrastructure
};
