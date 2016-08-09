import Rx from 'rxjs/Rx'
import  {
  setValidMidiSourceDevice,
  setMidiSourceDevice,
  setAllMidiSourceDevices,
  setValidMidiSinkDevice,
  setMidiSinkDevice,
  setAllMidiSinkDevices
} from '../../actions/midi'
import { toObservable } from '../../lib/rx_redux'
import { midiBipol, bipolMidi } from '../../lib/transform'
import { union, difference, intersection } from '../../lib/setop'

export default function init(store, signalio) {

  let rawMidiInSubscription=null;

  let midiinfo= null;
  //hardware business
  let midisources = new Map(); //id -> device
  let midisinks = new Map(); //id -> device
  let midisource; //device
  let midiSourceChannel;
  let midiSourceCCs;
  let midiSinkChannel;
  let midiSinkCCs;
  let storeStream;
  let unsubscribe;

  const midiSourceFirehose = new Rx.Subject();

  // Interface to MIDI input
  function handleMidiInMessage (ev) {
    //filters CC messages out of midi bytes and turns them into key+value

    let cmd = ev.data[0] >> 4;
    let channel = ev.data[0] & 0x0f;
    let cc = ev.data[1];
    let val = midiBipol(ev.data[2]);
    //midievent[0] = cmd;
    console.debug('MODI', cmd, channel, cc, val);
    //midi commands
    //11: CC
    //9: Note on
    //8: Note off

    if ((cmd===11) &&
      (state.midiSourceChannel == channel) &&
      state.activesourceccs.has(cc)) {
        const upd = {}
        upd["midi-cc-"+ cc] = val
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
      176 + state.activesinkchannel,
      cc,
      scaled
    ];
    if (unmuted) {
      midiinfo.outputs.get(state.activesink).send(midibytes);
    };
  };

  //set up midi system
  function updateMidiIO(newmidiinfo) {
    let allsources = new Map();
    let allsinks = new Map();
    midiinfo = newmidiinfo;

    //turn the pseudo-Maps in the midiinfo dict into real maps
    for (let [key, val] of midiinfo.inputs.entries()){
      allsources.set(key, val.name)
      midisources.set(key, val)
    };
    store.dispatch(setAllMidiSourceDevices(allsources));
    for (let [key, val] of midiinfo.outputs.entries()){
      allsinks.set(key, val.name)
      midisinks.set(key, val)
    };
    store.dispatch(setAllMidiSinkDevices(allsinks));
    //If there is a device, select it.
    for (let key of allsources.keys()) {
      store.dispatch(setMidiSourceDevice(key));
    }
    for (let key of allsinks.keys()) {
      store.dispatch(setMidiSinkDevice(key));
    }
  };

  storeStream = toObservable(store);
  storeStream.pluck(
      'midi', 'midiSourceDevice'
    ).distinctUntilChanged().subscribe(
      (key) => {
        console.log("midisourcekey", key);
        if (midiinfo !==null) {
          if (rawMidiInSubscription !== null) {
            rawMidiInSubscription.dispose()
          };
          rawMidiInSubscription = Rx.Observable.fromEvent(
            midiinfo.inputs.get(key), 'midimessage'
          ).subscribe(handleMidiInMessage);
        }
      }
  )
  storeStream.pluck(
      'midi', 'midiSinkDevice'
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
