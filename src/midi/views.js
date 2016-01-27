'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var model = require('./models');
var intents = require('./intents');

var MidiInDeviceSelectComponent = function(props) {
  //var disabled = props.newdeviceinfo.inputs ? 'false' : 'true';
  let disabled;
  let inputNodes;
  let defaultValue;
  if ((props.state.midiinfo !== null) && (props.state.midiinfo.inputs.size>0)) {
    disabled=false;
    defaultValue = props.state.activeindevice;
    let allindevices = props.state.allindevices;
    inputNodes = [];
    for (var [key, device] of allindevices.entries()) {
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

function renderMidiIn(midistate, mountpoint) {
  return ReactDOM.render(
    <MidiInDeviceSelectComponent state={midistate} />,
    mountpoint);
};

module.exports = {
  renderMidiIn: renderMidiIn
};
