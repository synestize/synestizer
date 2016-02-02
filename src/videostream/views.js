'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var model = require('./models');
var intents = require('./intents');

var VideoInSelect = function(props) {
  return (<div className="widget">
    <h2>Video In</h2>
    <VideoInDeviceSelect activedevice={props.activedevice} alldevices={props.alldevices} />
  </div>)
};
var VideoInDeviceSelect = function(props) {
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
    <select name="midiInDevice" id="midiInDevice" className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.selectVideoInDevice(ev.target.value)}>
      {deviceOptNodes}
    </select>
  </div>
  )
};
function renderVideoIn(state, mountpoint) {
  return ReactDOM.render(
    <VideoInSelect activedevice={state.activeindevice} alldevices={state.allindevices} activechannel={state.activeinchannel}
      activeccs={state.activeinccs} />,
    mountpoint);
};

module.exports = {
  renderVideoIn: renderVideoIn
};
