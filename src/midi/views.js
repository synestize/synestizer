'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var model = require('./models');
var intents = require('./intents');

var MidiInDeviceSelectComponent = function(props) {
  //var disabled = props.newdeviceinfo.inputs ? 'false' : 'true';
  var disabled;
  var inputNodes;
  if ((props.state.midiinfo !== null) && (props.state.midiinfo.inputs.size>0)) {
    disabled="false";
    inputNodes = props.state.midiinfo.inputs.map(function (device, key) { 
      console.debug(device, key);
      return (<option key="{key}" value="{key}">{device.name}</option>)
    });
  } else {
    disabled="true";
    inputNodes = ([<option key="none" value="none">none</option>])
  };
  return (<div className="widget">
  <h2>Midi In</h2>
    <select name="midiInDevice" id="midiInDevice" className="midiselect" disabled="{disabled}">
      {inputNodes}
    </select>
  </div>)
};

function renderMidiIn(midistate, mountpoint) {
  console.debug("midistate");
  console.debug(midistate);
  ReactDOM.render(
    <MidiInDeviceSelectComponent state={midistate} />,
    mountpoint);
};

module.exports = {
  renderMidiIn: renderMidiIn
};
