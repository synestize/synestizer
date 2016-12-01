import {Subject} from 'rxjs/Subject'
import {Observable} from 'rxjs/Observable'
import {Observer} from 'rxjs/Observer'
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/share';
import  {
  setValidMidiSourceDevice,
  setMidiSourceDevice,
  setAllMidiSourceDevices,
  setValidMidiSinkDevice,
  setMidiSinkDevice,
  setAllMidiSinkDevices
} from '../actions/midi'
import { toObservable } from '../lib/rx_redux'
import { midiBipol, bipolMidi } from '../lib/transform'
import { midiInStreamName, midiOutStreamName } from '../io/midi/util'

export default function init(store, signalio) {
  if (!navigator.requestMIDIAccess) {
    return {
      playNote: ()=>undefined
    }
  }
  let rawMidiInSubscription = undefined;
  let rawMidiOutSubscription = undefined;
  let midiinfo = undefined;
  //hardware business
  let sourceChannel;
  let sourceCCs;
  let sourceCCMap = {};
  let sinkDevice = undefined;
  let sinkChannel;
  let sinkCCs;
  let sinkCCMap = {};
  let sinkSoloCC;
  let validSource = false;
  let validSink = false;
  let storeStream = toObservable(store);

  // Interface to MIDI input
  function handleMidiInMessage (ev) {
    //filters CC messages out of midi bytes and turns them into key+value
    let cmd = ev.data[0] >> 4;
    let channel = ev.data[0] & 0x0f;
    let cc = ev.data[1];
    let val = midiBipol(ev.data[2]);
    // midievent[0] = cmd;
    // console.debug('MODI', cmd, channel, cc, val);
    // midi commands
    // 11: CC
    // 9: Note on
    // 8: Note off

    if (
      (cmd===11) &&
      (sourceChannel == channel) &&
      (sourceCCs.indexOf(cc)>-1)
    ) {
      const upd = {}
      upd[midiInStreamName(cc)[0]] = val
      // console.debug('MIDO', upd);
      signalio.sourceUpdates.next(upd);
    };
  };
  //Interface to MIDI output
  function handleSink(sinkState) {
    for (let key in sinkState) {
      let cc = sinkCCMap[key];
      if (cc !== undefined) {
        emitMidiOutCC(cc, sinkState[key])
      }
    }
  };

  function emitMidiOutCC(cc, scaled) {
    if (sinkDevice === undefined) return
    if ((sinkSoloCC > 0) && (sinkSoloCC !== cc)) return

    // turns [["midi",16,0.5]
    // into [177,16,64]
    let midibytes = [
      176 + sourceChannel,
      cc,
      bipolMidi(scaled)
    ];
    sinkDevice.send(midibytes);
  };

  function playNote({pitch=60, vel=80, chan=0, dur=100, time=0}) {
    // Flakey Midi Emission
    // We should actually dedupe using a master per-channel notebag.
    // Otherwise we will get stuck notes.
    if (sinkDevice === undefined) return;

    sinkDevice.send(
      [0x90 + chan, pitch, vel],
      time );
    sinkDevice.send(
      [0x80 + chan, pitch, 0],
      Math.max(window.performance.now(), time) + dur
    );
  };

  //set up midi system
  function updateMidiIO(newmidiinfo) {
    let sourceNames = new Map();
    let sinkNames = new Map();
    let state = store.getState();
    // console.debug('updateMidiIO', newmidiinfo);
    midiinfo = newmidiinfo;

    for (let [key, val] of midiinfo.inputs.entries()){
      sourceNames.set(key, val.name)
    };
    let sourceDevice = state.midi.sourceDevice || midiinfo.inputs.keys()[0];
    store.dispatch(setAllMidiSourceDevices(sourceNames));

    for (let [key, val] of midiinfo.outputs.entries()){
      sinkNames.set(key, val.name)
    };
    let sinkDevice = state.midi.sinkDevice || midiinfo.outputs.keys()[0];
    store.dispatch(setAllMidiSinkDevices(sinkNames))

    store.dispatch(setMidiSourceDevice(sourceDevice));
    store.dispatch(setValidMidiSourceDevice(false));

    store.dispatch(setMidiSinkDevice(sinkDevice));
    store.dispatch(setValidMidiSinkDevice(false));
  };

  // Now that the MIDI system is set up, plug this app in to it.
  function plugMidiIn() {
    const key = store.getState().midi.sourceDevice;
    if (midiinfo !== undefined) {
      let dev = midiinfo.inputs.get(key);
      // console.debug('plugMidiIn', key, typeof key, dev, typeof dev)
      if (rawMidiInSubscription !== undefined) {
        rawMidiInSubscription.unsubscribe()
      };
      if (dev !== undefined ) {
        rawMidiInSubscription = Observable.fromEvent(
          dev, 'midimessage'
        ).subscribe(handleMidiInMessage);
        store.dispatch(setValidMidiSourceDevice(true));
      }
    }
  }
  function plugMidiOut() {
    const key = store.getState().midi.sinkDevice;
    // console.debug('plugMidiOut', key)
    if (midiinfo !== undefined) {
      // console.debug('plugMidiOut2', key, midiinfo.outputs.get(key))
      sinkDevice = midiinfo.outputs.get(key);
      if (rawMidiOutSubscription !== undefined) {
        rawMidiOutSubscription.unsubscribe()
      };
      rawMidiOutSubscription = signalio.sinkStateSubject.subscribe(handleSink)
      store.dispatch(setValidMidiSinkDevice(sinkDevice !== undefined));
    } else {
      store.dispatch(setValidMidiSinkDevice(false));
    }
  }
  // Now, actually use this infrastructure
  plugMidiIn()
  storeStream.pluck(
      'midi', 'sourceDevice'
    ).distinctUntilChanged().subscribe(plugMidiIn)
  storeStream.pluck(
      '__volatile', 'midi', 'validSource'
    ).distinctUntilChanged().subscribe((validity)=> {
      validSource = validity;
      plugMidiIn()
    })
  storeStream.pluck(
      'midi', 'sourceChannel'
    ).distinctUntilChanged().subscribe(
      (x) => sourceChannel = x
  )
  storeStream.pluck(
      'midi', 'sourceCCs'
    ).distinctUntilChanged().subscribe(
      (x) => sourceCCs = x
  )
  storeStream.pluck(
      'midi', 'sourceCCMap'
    ).distinctUntilChanged().subscribe(
      (x) => sourceCCMap = (x || {})
  )
  plugMidiOut()
  storeStream.pluck(
      'midi', 'sinkDevice'
    ).distinctUntilChanged().subscribe((key) => {
      // console.debug('sinkDevice', key)
      plugMidiOut()
    });
  storeStream.pluck(
      '__volatile', 'midi', 'validSink'
    ).distinctUntilChanged().subscribe((validity)=> {
      validSink = validity;
      plugMidiOut()
    });
  storeStream.pluck(
      'midi', 'sinkChannel'
    ).distinctUntilChanged().subscribe(
      (x) => sinkChannel = x
  )
  storeStream.pluck(
      'midi', 'sinkCCs'
    ).distinctUntilChanged().subscribe(
      (x) => sinkCCs = x
  )
  storeStream.pluck(
      'midi', 'sinkCCMap'
    ).distinctUntilChanged().subscribe(
      (x) => sinkCCMap = (x || {})
  )
  storeStream.pluck(
      'midi', 'sinkSoloCC'
    ).distinctUntilChanged().subscribe((x)=>sinkSoloCC=x);

  Observable.fromPromise(
    navigator.requestMIDIAccess()
  ).subscribe((midiinfo) => {
    updateMidiIO(midiinfo)
    plugMidiOut()
    plugMidiIn()
  },
    (err) => console.debug(err.stack)
  );

  return {
    playNote: playNote
  }
};
