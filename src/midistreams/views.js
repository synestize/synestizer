'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var model = require('./models');
var intents = require('./intents');

var MidiInSelectComponent = function(props) {
  return (<div className="widget">
    <h2>Midi In</h2>
    <MidiInDeviceSelectComponent activedevice={props.activedevice} alldevices={props.alldevices} />
    <MidiInChannelSelectComponent activechannel={props.activechannel} activedevice={props.activedevice} />
  </div>)
};
var MidiInDeviceSelectComponent = function(props) {
  let disabled;
  let deviceOptNodes;
  let selectValue;
  if ((props.alldevices.size>0)) {
    disabled=false;
    selectValue = props.activedevice;
    deviceOptNodes = [];
    for (var [key, devicename] of props.alldevices.entries()) {
      deviceOptNodes.push(
        <option key={key} value={key}>{devicename}</option>
      )
    };
  } else {
    disabled = true;
    selectValue = "none";
    deviceOptNodes = [<option key="none" value="none">none</option>];
  };
  return (<div>
    <label htmlFor="midiInDevice">Device </label>
    <select name="midiInDevice" id="midiInDevice" className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.selectMidiInDevice(ev.target.value)}>
      {deviceOptNodes}
    </select>
  </div>
  )
};
var MidiInChannelSelectComponent = function(props) {
  var disabled, selectValue, channelOptNodes;
  disabled = (props.activedevice !== null);
  selectValue = props.activeinchannel || 1;
  channelOptNodes = [];
  for (var i=1; i<=16; i++) {
    channelOptNodes.push(
      <option key={i} value={i}>{i}</option>
    );
  };
  return (<div>
    <label htmlFor="midiInChan">Channel</label>
    <select name="midiInChan" id="midiInChan" className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.selectMidiInChannel(parseInt(ev.target.value))}>
      {channelOptNodes}
    </select>
  </div>)
};
var MidiInControlSetSelectComponent = function(props) {
  var disabled, selectValue, controlSelectNodes;
  controlSelectNodes = [];
  disabled = (props.activedevice !== null);
  for (controlNum of props.activecontrols) {
    controlSelectNodes.push(
      <MidiInControlSelectComponent />
    );
  };
  return (<div className="widget">{controlSelectNodes}
  </div>
  )
};
var MidiInControlSelectComponent = function(props) {
  var disabled, selectValue, controlOptNodes;
  disabled = (props.activedevice !== null);
  selectValue = props.activeinchannel || 1;
  for (var i=0; i<=127; i++) {
    controlOptNodes.push(
      <option key={i} value={i}>{i}</option>
    );
  }
  return (<div className="widget">
    <select name="midiInControl" id="midiInControl" className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.selectMidiInControl(parseInt(ev.target.value))}>
      {controlOptNodes}
    </select>
    <button>-</button>
  </div>)
};
function renderMidiIn(state, mountpoint) {
  return ReactDOM.render(
    <MidiInSelectComponent activedevice={state.activeindevice} alldevices={state.allindevices} activechannel={state.activechannel}
      activecontrols={state.incontrols} />,
    mountpoint);
};

module.exports = {
  renderMidiIn: renderMidiIn
};
