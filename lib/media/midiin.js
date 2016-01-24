//  MIDI input. This is a singleton.

'use strict';
var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var MidiIn, state, mountpoint, aggregatemidiinstream;
var state = {
  devices: [],
  activedevices: [],
  controls: []
};
var MidiDeviceStream = new Rx.ReplaySubject(1);


function querymidi() {
  Rx.Observable.fromPromise(
    global.navigator.requestMIDIAccess()
  ).subscribe(
    x => MidiDeviceStream.onNext(x),
    err => console.debug(err.stack)
  );
};
var MidiInDeviceSelectComponent (devices ) => (<div class="widget">
  <h2>Midi In</h2>
    <select name="midiInDevice" id="midiInDevice" class="midiselect">
      <option>none</option>
    </select>
  </div>
);

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