'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var model = require('./models');
var intents = require('./intents');

var MidiInDeviceSelectComponent = function(props) {
  let disabled;
  let inputNodes;
  let defaultValue;
  console.debug("props", props);
  if ((props.allindevices.size>0)) {
    disabled=false;
    defaultValue = props.activeindevice;
    inputNodes = [];
    for (var [key, device] of props.allindevices.entries()) {
      inputNodes.push(
        <option key={key} value={key}>{device.name}</option>
      )
    };
  } else {
    disabled=true;
    defaultValue = "none";
    inputNodes = [<option key="none" value="none">none</option>];
  };
  return (<div className="widget">
  <h2>Midi In</h2>
    <select name="midiInDevice" id="midiInDevice" className="midiselect" disable={disabled} defaultValue={defaultValue}>
      {inputNodes}
    </select>
  </div>)
};

function renderMidiIn(state, mountpoint) {
  
  return ReactDOM.render(
    <MidiInDeviceSelectComponent activeindevice={state.activeindevice} allindevices={state.allindevices} />,
    mountpoint);
};

module.exports = {
  renderMidiIn: renderMidiIn
};
