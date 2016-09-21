import Rx from 'rxjs/Rx'
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
  let rawMidiInSubscription = null;
  let rawMidiOutSubscription = null;
  let midiinfo = null;
  //hardware business
  let sourceChannel;
  let sourceCCs;
  let sourceCCMap = {};
  let sinkDevice = null;
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
    let unmuted = ((sinkSoloCC === null) || (sinkSoloCC===cc)) &&
      (sinkDevice !== null);
    if (!unmuted) {return}
    //turns [["midi",16,0.5]
    //into [177,16,64]
    let midibytes = [
      176 + sourceChannel,
      cc,
      bipolMidi(scaled)
    ];
    sinkDevice.send(midibytes);
  };

  //set up midi system
  function updateMidiIO(newmidiinfo) {
    let sourceNames = new Map();
    let sinkNames = new Map();
    let state = store.getState();

    midiinfo = newmidiinfo;

    for (let [key, val] of midiinfo.inputs.entries()){
      sourceNames.set(key, val.name)
    };
    store.dispatch(setAllMidiSourceDevices(sourceNames));
    for (let [key, val] of midiinfo.outputs.entries()){
      sinkNames.set(key, val.name)
    };
    store.dispatch(setAllMidiSinkDevices(sinkNames));
    if (sourceNames.has(state.midi.sourceDevice)) {
      store.dispatch(setMidiSourceDevice(state.midi.sourceDevice));
      store.dispatch(setValidMidiSourceDevice(true));
    } else {
      store.dispatch(setValidMidiSourceDevice(false));
    }
    if (sinkNames.has(state.midi.sinkDevice)) {
      store.dispatch(setMidiSinkDevice(state.midi.sinkDevice));
      store.dispatch(setValidMidiSinkDevice(true));
    } else {
      store.dispatch(setValidMidiSinkDevice(false));
    }
  };

  // Now that the MIDI system is set up, plug this app in to it.
  function plugMidiIn() {
    const key = store.getState().midi.sourceDevice;
    if (midiinfo !== null) {
      let dev = midiinfo.inputs.get(key);
      if (rawMidiInSubscription !== null) {
        rawMidiInSubscription.unsubscribe()
      };
      rawMidiInSubscription = Rx.Observable.fromEvent(
        dev, 'midimessage'
      ).subscribe(handleMidiInMessage);
    }
  }
  function plugMidiOut() {
    const key = store.getState().midi.sinkDevice;
    if (midiinfo !==null) {
      sinkDevice = midiinfo.outputs.get(key);
      if (rawMidiOutSubscription !== null) {
        rawMidiOutSubscription.unsubscribe()
      };
      rawMidiOutSubscription = signalio.sinkStateSubject.subscribe(handleSink)
    }
  }
  //Now actually use this infrastructure
  plugMidiIn()
  storeStream.pluck(
      'midi', 'sourceDevice'
    ).distinctUntilChanged().subscribe(plugMidiIn)
  storeStream.pluck(
      '__volatile', 'midi', 'validSource'
    ).distinctUntilChanged().subscribe(
      (validity)=> {validSource = validity; plugMidiIn()}
    )
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
    ).distinctUntilChanged().subscribe(plugMidiOut);
  storeStream.pluck(
      '__volatile', 'midi', 'validSink'
    ).distinctUntilChanged().subscribe(
      (validity)=> {validSink = validity; plugMidiOut()}
    )
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

  Rx.Observable.fromPromise(
    navigator.requestMIDIAccess()
  ).subscribe(updateMidiIO,
    (err) => console.debug(err.stack)
  );
  return {
    playNote: () => null
  }
};
