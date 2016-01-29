'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var model = require('./models');
var intents = require('./intents');

var MidiInSelect = function(props) {
  return (<div className="widget">
    <h2>Midi In</h2>
    <MidiInDeviceSelect activedevice={props.activedevice} alldevices={props.alldevices} />
    <MidiInChannelSelect activechannel={props.activechannel} activedevice={props.activedevice} />
    <MidiInControlSetSelect activecontrols={props.activecontrols} activedevice={props.activedevice} />
  </div>)
};
var MidiInDeviceSelect = function(props) {
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
var MidiInChannelSelect = function(props) {
  var disabled, selectValue, channelOptNodes;
  disabled = (props.activedevice !== null);
  selectValue = props.activechannel || 1;
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
var MidiInControlSetSelect = function(props) {
  var disabled, selectValue, controlSelectNodes;
  controlSelectNodes = [];
  disabled = (props.activedevice !== null);
  for (let controlNum of props.activecontrols) {
    controlSelectNodes.push(
      <MidiInControlSelect controlNum={controlNum} key={controlNum} activedevice={props.activedevice} activecontrols={props.activecontrols}/>
    );
  };
  return (<div className="widget">
    {controlSelectNodes}
    <button>+</button>
  </div>
  )
};
var MidiInControlSelect = function(props) {
  var disabled, selectValue, controlOptNodes=[];
  disabled = (props.activedevice !== null);
  selectValue = props.controlNum || 1;
  for (let i=0; i<=127; i++) {
    controlOptNodes.push(
      <option key={i} value={i} disabled={props.activecontrols.has(i)}>{i}</option>
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
    <MidiInSelect activedevice={state.activeindevice} alldevices={state.allindevices} activechannel={state.activeinchannel}
      activecontrols={state.activeincontrols} />,
    mountpoint);
};

module.exports = {
  renderMidiIn: renderMidiIn
};
