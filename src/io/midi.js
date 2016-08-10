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

export default function init(store, signalio) {
  let rawMidiInSubscription = null;
  let midiinfo = null;
  //hardware business
  let sourceChannel;
  let sourceCCs;
  let sinkChannel;
  let sinkCCs;
  let storeStream;
  let unsubscribe;
  let sinkSoloCC;

  const midiSourceFirehose = new Rx.Subject();

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
      upd["midi-cc-"+ cc] = val
      // console.debug('MIDO', upd);
      signalio.sourceUpdates.next(upd);
    };
  };
  //Interface to MIDI output
  function handleMidiOutMessage(cc, scaled) {
    let unmuted = ((state.solocc === null) || (state.solocc===cc)) &&
      (midiinfo.outputs.get(state.activesink) !== undefined);
    //turns [["midi",16,0.5]
    //into [177,16,64]
    let midibytes = [
      176 + sourceChannel,
      cc,
      scaled
    ];
    if (unmuted) {
      midiinfo.outputs.get(state.activesink).send(midibytes);
    };
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

  function plugMidiIn() {
    const key = store.getState().midi.sourceDevice;
    if (midiinfo !==null) {
      let dev = midiinfo.inputs.get(key);
      if (rawMidiInSubscription !== null) {
        rawMidiInSubscription.unsubscribe()
      };
      rawMidiInSubscription = Rx.Observable.fromEvent(
        dev, 'midimessage'
      ).subscribe(handleMidiInMessage);
    }
  }
  storeStream = toObservable(store);
  storeStream.pluck(
      'midi', 'sourceDevice'
    ).distinctUntilChanged().subscribe(plugMidiIn)
  storeStream.pluck(
      '__volatile', 'midi', 'validSource'
    ).distinctUntilChanged().subscribe(plugMidiIn)

  storeStream.pluck(
      'midi', 'sourceChannel'
    ).distinctUntilChanged().subscribe(
      (x) => {
        sourceChannel = x;
        console.debug("midisourcechannel", x);
      }
  )
  storeStream.pluck(
      'midi', 'sinkChannel'
    ).distinctUntilChanged().subscribe(
      (x) => {
        sinkChannel = x;
        console.debug("midisinkchannel", x);
      }
  )
  storeStream.pluck(
      'midi', 'sourceCCs'
    ).distinctUntilChanged().subscribe(
      (x) => {
        sourceCCs = x;
        console.log("midisourceccs", x);
      }
  )
  storeStream.pluck(
      'midi', 'sinkDevice'
    ).distinctUntilChanged().subscribe(
      (key) => {
        console.log("midisinkkey", key);
      }
  )

  Rx.Observable.fromPromise(
    navigator.requestMIDIAccess()
  ).subscribe(updateMidiIO,
    (err) => console.debug(err.stack)
  );
  return {
    playNote: () => null
  }
};
