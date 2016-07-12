import Rx from 'rx'
import  { setValidMidiSourceDevice, setMidiSourceDevice, setAllMidiSourceDevices, setValidMidiSinkDevice, setMidiSinkDevice, setAllMidiSinkDevices, } from '../../actions/midi'
import { toObservable } from '../../lib/rx_redux'
import { midiBipol, bipolMidi } from '../../lib/transform'
import { union, difference, intersection } from '../../lib/setop'

let rawMidiInSubscription;

let midiinfo= null;
//hardware business
let midisources = new Map(); //id -> device
let midisinks = new Map(); //id -> device
let midisource; //device

let store;
let storeStream;
let unsubscribe;

const midiSourceFirehose = new Rx.Subject();

// Interface to MIDI input
function handleMidiInMessage (ev) {
  //filters CC messages out of midi bytes and turns them into key+value
  //into ["midi",-3723423,1,16],-0.377
  //should this be some kind of transducer?

  let cmd = ev.data[0] >> 4;
  let channel = ev.data[0] & 0x0f;
  let cc = ev.data[1];
  let val = midiBipol(ev.data[2]);
  //midievent[0] = cmd;

  //midi commands
  //11: CC
  //9: Note on
  //8: Note off
  if ((cmd===11) &&
    (state.activesourcechannel == channel) &&
    state.activesourceccs.has(cc)) {

    streamPatch.getSourceStream("midi-cc-"+ cc).onNext(val);
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
  //If there is only one device, select it.
  if (allsources.size===1) {
    for (let key of allsources.keys()) {
      store.dispatch(setMidiSourceDevice(key));
    }
  }
  if (allsinks.size===1) {
    for (let key of allsources.keys()) {
      store.dispatch(setMidiSinkDevice(key));
    }
  }
};

export default function init(store_, streamio_) {
  store = store_;
  storeStream = toObservable(store);
  storeStream.subscribe((state)=>console.debug("MIDISTATENOW", state));
  storeStream.pluck('midi', 'midiSourceDevice').distinctUntilChanged().subscribe(
    (key) => {
      //doMidiPlumbing(key);
      console.log("midkey", key);
    }
  )

  Rx.Observable.fromPromise(
    navigator.requestMIDIAccess()
  ).subscribe(updateMidiIO,
    (err) => console.debug(err.stack)
  );
  //publishSources();
};
