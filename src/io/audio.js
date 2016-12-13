import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { saturate, desaturate } from '../lib/transform.js'
import  {
  setValidAudioSourceDevice,
  setAudioSourceDevice,
  setAllAudioSourceDevices,
  setValidAudioSinkDevice,
  setAudioSinkDevice,
  setAllAudioSinkDevices,
  setAllAudioSinkControlActualValues,
  setAudioReady,
  addSample
} from '../actions/audio'
import { toObservable } from '../lib/rx_redux'
import { deviceSubject } from '../lib/av'

let SIGNAL_RATE = 1.0/(SIGNAL_PERIOD_MS/1000)

import Tone from 'tone/build/Tone.js'
window.Tone = Tone;
import bubbleChamber_ from './audio/bubbleChamber'
import recordBuffer_ from './audio/recordBuffer'

export default function init(store, signalio, midiio) {
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
  let buffers;
  let bufferMeta={};

  let actualControlValueStream = new BehaviorSubject(
    store.getState().audio.sinkControlBias
  );
  let ensembles = {}
  let actualControlValues = actualControlValueStream.share()
  const audioInfrastructure = {
    actualControlValues,
    ensembles,
    bufferMeta
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

  Observable.combineLatest(
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
  Observable.combineLatest(
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
  Observable.combineLatest(
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
    Observable.fromPromise(
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
    Tone.setContext(context);
    Object.assign(audioInfrastructure, {
      context,
    });

    store.dispatch(addSample({
      key: 'angklung',
      name: 'Angklung',
    }));
    bufferMeta.angklung = {
      root: 'c4'
    }
    store.dispatch(addSample({
      key: 'woodenspoon',
      name: 'Wooden Spoon',
    }));
    bufferMeta.woodenspoon = {
      root: 'c4'
    }
    store.dispatch(addSample({
      key: 'kayageum',
      name: 'Kayageum',
    }));
    bufferMeta.kayageum = {
      root: 'b4'
    }
    store.dispatch(addSample({
      key: 'synthtom',
      name: 'Synth Tom',
    }));
    bufferMeta.synthtom = {
      root: 'c1'
    }
    store.dispatch(addSample({
      key: 'jentreng',
      name: 'Jentreng',
    }));
    bufferMeta.jentreng = {
      root: 'e3'
    }
    store.dispatch(addSample({
      key: 'tarawangsa',
      name: 'Tarawangsa',
    }));
    bufferMeta.tarawangsa = {
      root: 'c4'
    }
    store.dispatch(addSample({
      key: 'gendong',
      name: 'Gendong',
    }));
    bufferMeta.gendong = {
      root: 'c3'
    }
    store.dispatch(addSample({
      key: 'tabla',
      name: 'Tabla Na',
    }));
    bufferMeta.tabla = {
      root: 'd3'
    }
    store.dispatch(addSample({
      key: 'panflute',
      name: 'Pan Flute',
    }));
    bufferMeta.panflute = {
      root: 'c4'
    }
    store.dispatch(addSample({
      key: 'vibraphone',
      name: 'Vibraphone',
    }));
    bufferMeta.vibraphone = {
      root: 'c3',
    };
    store.dispatch(addSample({
      key: 'piano',
      name: 'Piano',
    }));
    bufferMeta.piano = {
      root: 'c3',
    };
    store.dispatch(addSample({
      key: 'vox1',
      name: 'Vox 1',
    }));
    bufferMeta.vox1 = {
      root: 'c3',
    };
    store.dispatch(addSample({
      key: 'vox2',
      name: 'Vox 2',
    }));
    bufferMeta.vox2 = {
      root: 'c4',
    };
    store.dispatch(addSample({
      key: 'vox3',
      name: 'Vox 3',
    }));
    bufferMeta.vox3 = {
      root: 'a#3',
    };
    store.dispatch(addSample({
      key: 'vox4',
      name: 'Vox 4',
    }));
    bufferMeta.vox4 = {
      root: 'a#4',
    };
    store.dispatch(addSample({
      key: 'vox5',
      name: 'Vox 5',
    }));
    bufferMeta.vox5 = {
      root: 'f2'
    };
    store.dispatch(addSample({
      key: 'goblet',
      name: 'Goblet',
    }));
    bufferMeta.goblet = {
      root: 'g3',
    };
    bufferMeta.blippo = {
      root: 'c4',
    };
    store.dispatch(addSample({
      key: 'blippo',
      name: 'Blippo Plong',
    }));
    bufferMeta.drip = {
      root: 'e5',
    };
    store.dispatch(addSample({
      key: 'drip',
      name: 'Drip',
    }));
    bufferMeta.dripdrop = {
      root: 'c5',
    };
    store.dispatch(addSample({
      key: 'dripdrop',
      name: 'Drip Drop',
    }));
    bufferMeta.flexotone = {
      root: 'b5',
    };
    store.dispatch(addSample({
      key: 'flexotone',
      name: 'Flexotone',
    }));
    /*
    store.dispatch(addSample({
      key: '_user_1',
      name: '_User:1',
    }));
    bufferMeta._user_1 = {
      root: 'c3',
    };
    store.dispatch(addSample({
      key: '_user_2',
      name: '_User:2',
    }));
    bufferMeta._user_2 = {
      root: 'c3',
    };
    store.dispatch(addSample({
      key: '_user_3',
      name: '_User:3',
    }));
    bufferMeta._user_3 = {
      root: 'c3',
    };
    store.dispatch(addSample({
      key: '_user_4',
      name: '_User:4',
    }));
    bufferMeta._user_4 = {
      root: 'c3',
    };
    */
    buffers = new Tone.Buffers({
      'angklung': './sound/angklung_c4.mp3',
      'woodenspoon': './sound/woodenspoon_c4.mp3',
      'kayageum': './sound/kayageum_b4.mp3',
      'jentreng': './sound/jentreng_e3.mp3',
      'tarawangsa': './sound/tarawangsa_c4.mp3',
      'gendong': './sound/gendong_tap_c3.mp3',
      'tabla': './sound/tabla_na_d3.mp3',
      'panflute': './sound/panflute_c4.mp3',
      'vibraphone': './sound/vibraphone_c3.mp3',
      'piano': './sound/piano_c3.mp3',
      'vox1': './sound/voice_c3.mp3',
      'vox2': './sound/voice_c4.mp3',
      'vox3': './sound/voice_as3.mp3',
      'vox4': './sound/voice_as4.mp3',
      'vox5': './sound/monk_f2.mp3',
      'goblet': './sound/goblet_g3.mp3',
      'synthtom': './sound/synthtom_c1.mp3',
      'blippo': './sound/blippo_c4.mp3',
      'drip': './sound/drip_e5.mp3',
      'dripdrop': './sound/dripdrop_c5.mp3',
      'flexotone': './sound/flexotone_b5.mp3',
      /*
      '_user_1': './sound/silence.mp3',
      '_user_2': './sound/silence.mp3',
      '_user_3': './sound/silence.mp3',
      '_user_4': './sound/silence.mp3',
      */
    }, () => {
      // The callback for when all buffers are loaded
      // This is a terrible init procedure, since it defers building the controls uneccessarily.
      // An Observable would be better.
      // Also, it seems to get called *twice*,
      // once actually before the buffers load.
      Object.assign(audioInfrastructure, {
        buffers,
      });
      // console.debug('buffers loaded', buffers.loaded, buffers);
      if (buffers.loaded) {
        ensembles.bubbleChamber = bubbleChamber_(
          store, signalio, audioInfrastructure, midiio
        )
        ensembles.recordBuffer = recordBuffer_(
          store, signalio, audioInfrastructure, midiio
        )
      }
    });

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
    // Work around occasional scheduler bug by starting at a high tempo
    Tone.Transport.bpm.value = 1100
    Tone.Transport.start('+1');
    Tone.Transport.scheduleOnce(() => {
      // console.debug('pickles',  store.getState().audio.master);
      Tone.Transport.bpm.value = store.getState().audio.master.tempo || 100
    }, '+5')
  };

  Observable.combineLatest(
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
  actualControlValues.sampleTime(UI_PERIOD_MS).subscribe((vals) => {
    store.dispatch(setAllAudioSinkControlActualValues(vals));
  });

  /// Master parameters are special and are handled differently, through the UI direct
  Observable.combineLatest(
    storeStream.pluck(
      'audio', 'master', 'gain'
    ),
    storeStream.pluck(
      'audio', 'master', 'mute'
    ),
  ).subscribe(
    ([gain, mute]) => {
      // console.debug('gm', gain, mute);
      //I'm sure there is a more "RX" way of doing this.
      Tone.Master.mute = mute;
      if (!mute) Tone.Master.volume.rampTo(gain, 0.1)
    }
  );
  // We sample the tempo slider once per second because of instability
  storeStream.pluck(
    'audio', 'master', 'tempo'
  ).sampleTime(1000).distinctUntilChanged().subscribe((bpm)=>{
    if (Tone.Transport.state === "started") {
      console.debug('bpm', bpm, Tone.Transport.bpm.value)
      Tone.Transport.bpm.value = bpm
    }
  });
  return audioInfrastructure
};
