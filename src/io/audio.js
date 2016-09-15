import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { share } from 'rxjs/operator/share';
import { saturate, desaturate } from '../lib/transform.js'
import  {
  setValidAudioSourceDevice,
  setAudioSourceDevice,
  setAllAudioSourceDevices,
  setValidAudioSinkDevice,
  setAudioSinkDevice,
  setAllAudioSinkDevices,
  publishAudioSinkSignal,
  unpublishAudioSinkSignal,
  setAllAudioSinkControlActualValues
} from '../actions/audio'
import { toObservable } from '../lib/rx_redux'
import { deviceSubject } from '../lib/av'
import { audioSinkStreamName } from './audio/util'
import {SIGNAL_RATE, UI_RATE } from '../settings'

import Tone from 'tone/build/Tone.js'
window.Tone = Tone;
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
  let  actualControlValues = actualControlValueStream.share()
  const audioInfrastructure = {
    actualControlValues,
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
      //Tone.dispose()
      context.close()
    }
    sourceDevice = dev;
    context = new window.AudioContext();
    window.audioContext = context;
    Tone.setContext(context)
    let masterCompressor = new Tone.Compressor({
    	"threshold" : -6,
    	"ratio" : 2,
    	"attack" : 0.5,
    	"release" : 0.1
    });
    //route everything through
    //compressor before going to the speakers
    let meter = new Tone.Meter("level");
    Tone.Master.chain(masterCompressor, meter);
    Object.assign(audioInfrastructure, {
      context,
      tone: Tone
    });
    Tone.Transport.start();
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
    '__volatile', 'audio', 'validSource'
  ).distinctUntilChanged().subscribe(
    (validity)=> {validSource = validity;}
  )
  storeStream.pluck(
    'audio', 'sinkDevice'
  ).distinctUntilChanged().subscribe(
    doAudioSinkDevicePlumbing
  )
  storeStream.pluck(
    '__volatile', 'audio', 'validSink'
  ).distinctUntilChanged().subscribe(
    (validity)=> {validSink = validity; doAudioSinkDevicePlumbing()}
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
  //
  actualControlValues.throttleTime(UI_RATE).subscribe((vals) => {
    store.dispatch(setAllAudioSinkControlActualValues(vals));
  });

  /// Master parameters are special and are handled differently, through the UI direct
  storeStream.pluck(
    'audio', 'master', 'gain'
  ).distinctUntilChanged().subscribe((db)=>Tone.Master.volume.rampTo(db, 0.1))
  storeStream.pluck(
    'audio', 'master', 'mute'
  ).distinctUntilChanged().subscribe((val)=>{
    console.debug('mute', val);
    Tone.Master.mute = val
  })
  storeStream.pluck(
    'audio', 'master', 'tempo'
  ).distinctUntilChanged().subscribe((bpm)=>Tone.Transport.bpm.rampTo(bpm, 0.1))
  return audioInfrastructure
};
