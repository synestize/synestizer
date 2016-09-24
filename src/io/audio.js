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
  setAllAudioSinkControlActualValues,
  setAudioReady
} from '../actions/audio'
import { toObservable } from '../lib/rx_redux'
import { deviceSubject } from '../lib/av'
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
  let audioReady = false;
  let storeStream = toObservable(store).share();

  let actualControlValueStream = new BehaviorSubject(
    store.getState().audio.sinkControlBias
  );
  let ensembles = {}
  let actualControlValues = actualControlValueStream.share()
  const audioInfrastructure = {
    actualControlValues,
    ensembles
  }
  // set up audio system
  deviceSubject.subscribe(
    knowAudioDevices,
    (err) => console.debug(err.stack)
  )
  function knowAudioDevices(newdevinfo) {
    let sourceNames = new Map();
    let sinkNames = new Map();

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
  };

  Observable::combineLatest(
    storeStream.pluck(
      '__volatile', 'audio', 'sources'
    ).distinctUntilChanged(),
    storeStream.pluck(
      'audio', 'sourceDevice'
    ).distinctUntilChanged(),
  ).subscribe(
    ([allSources, sourceDev])=> {
      store.dispatch(
        setValidAudioSourceDevice(allSources.has(sourceDev))
      );
    }
  )
  Observable::combineLatest(
    storeStream.pluck(
      '__volatile', 'audio', 'sinks'
    ).distinctUntilChanged(),
    storeStream.pluck(
      'audio', 'sinkDevice'
    ).distinctUntilChanged(),
  ).subscribe(
    ([allSinks, sinkDev])=> {
      store.dispatch(
        setValidAudioSinkDevice(allSinks.has(sinkDev))
      );
    }
  )

  storeStream.pluck(
    '__volatile', 'audio', 'validSink'
  ).distinctUntilChanged().subscribe((valid)=>{
    if (valid) {
      doAudioSinkDevicePlumbing();
    }
  });
  Observable::combineLatest(
    storeStream.pluck(
      '__volatile', 'audio', 'validSink'
    ).distinctUntilChanged(),
    storeStream.pluck(
      '__volatile', 'audio', 'validSource'
    ).distinctUntilChanged()
  ).subscribe(([sourceValidity, sinkValidity])=>{
    if (sourceValidity & sinkValidity) {
      // doAudioSourcDevicePlumbing();
    }
  })

  function doAudioSinkDevicePlumbing() {
    const sinkDevKey = store.getState().audio.sinkDevice;
    Observable::fromPromise(
      navigator.mediaDevices.getUserMedia({deviceId:sinkDevKey, audio: true})
    ).subscribe(initAudioContext);
  }
  //Create a context with master out volume
  //Don't yet understand how this will work for the microphone etc
  function initAudioContext(sinkDev){
    if (context!==undefined) {
      //Tone.dispose()
      context.close()
    }
    sinkDevice = sinkDev;
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

  Observable::combineLatest(
    storeStream.pluck(
      'audio', 'sinkControls'
    ).distinctUntilChanged(),
    signalio.comboStateSubject,
    calcAudioControls
  ).subscribe(
    (val) => {
      actualControlValueStream.next(val)
    }
  );
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

  //
  actualControlValues.throttleTime(UI_RATE).subscribe((vals) => {
    store.dispatch(setAllAudioSinkControlActualValues(vals));
  });

  /// Master parameters are special and are handled differently, through the UI direct
  Observable::combineLatest(
    storeStream.pluck(
      'audio', 'master', 'gain'
    ),
    storeStream.pluck(
      'audio', 'master', 'mute'
    ),
  ).subscribe(
    ([gain, mute]) => {
      console.debug('gm', gain, mute);
      //I'm sure there is a more "RX" way of doing this.
      Tone.Master.mute = mute;
      if (!mute) Tone.Master.volume.rampTo(gain, 0.1)
    }
  );

  storeStream.pluck(
    'audio', 'master', 'tempo'
  ).subscribe((bpm)=>{
    Tone.Transport.bpm.rampTo(bpm, 0.1)
  });
  return audioInfrastructure
};
