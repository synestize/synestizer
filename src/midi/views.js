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
  if ((props.state.midiinfo !== null) && (props.state.midiinfo.inputs.size>0)) {
    disabled=false;
    let allindevices = props.state.allindevices;
    inputNodes = [];
    for (var [key, device] of allindevices.entries()) {
      inputNodes.push(
        <option key={key} value={key}>{device.name}</option>
      )
    };
  } else {
    disabled=true;
    inputNodes = [<option key="none" value="none">none</option>];
  };
  return (<div className="widget">
  <h2>Midi In</h2>
    <select name="midiInDevice" id="midiInDevice" className="midiselect" disable={disabled}>
      {inputNodes}
    </select>
  </div>)
};

function renderMidiIn(midistate, mountpoint) {
  ReactDOM.render(
    <MidiInDeviceSelectComponent state={midistate} />,
    mountpoint);
};

module.exports = {
  renderMidiIn: renderMidiIn
};
