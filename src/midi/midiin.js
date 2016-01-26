

function querymidi() {
  Rx.Observable.fromPromise(
    global.navigator.requestMIDIAccess()
  ).subscribe(
    x => MidiDeviceStream.onNext(x),
    err => console.debug(err.stack)
  );
};


MidiIn = {
  state : {
    devices: [],
    activedevices: [],
    controls: []
  }
};
state = MidiIn.state;

MidiIn.init = function (dom) {
  mountpoint = dom;
  MidiDeviceStream.subscribe(function(devices) {
    console.debug(devices);
    ReactDOM.render(
      <MidiInDeviceSelectComponent devices={devices} />,
      mountpoint
    )
  );
  querymidi();
};

function updatemididevices(devices) {
  console.debug(devices);
};
function listenTo(device) {
  device.onmidimessage = handleMidiMessage;
};
function ignore(device) {
  device.onmidimessage = null;
};
function handleMidiMessage (ev) {
  //for now this only filters midi CC values
  //turns [177,15,64]
  //into ["c",1,16,0.5]
  var midievent = new Array(4);
  var cmd = ev.data[0] >> 4;
  var channel = ev.data[0] & 0x0f;
  var idx = ev.data[1];
  var val = ev.data[2]/127;
  //midievent[0] = cmd;
  midievent[1] = channel;
  midievent[2] = idx;
  midievent[3] = val;
  
  //11: CC
  //9: Note on
  //8: Note off
  if (cmd===11) {
    midievent[0]="c";
    //console.debug("me", ev.data, midievent);
    indatastream.onNext(midievent);
  }
};

module.exports = MidiIn;