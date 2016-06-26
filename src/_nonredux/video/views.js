'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var intents = require('./intents');

var VideoInSelect = function(props) {
  return (<div className="streamcontrolset">
    <h2>Video In</h2>
    <VideoSourceSelect activedevice={props.activedevice} alldevices={props.alldevices} />
  </div>)
};
var VideoSourceSelect = function(props) {
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
  return (<div className="streamchooserwidget">
    <label htmlFor="videoSource">Device </label>
    <select name="videoSource" id="videoSource" className="videoselect" disable={disabled} value={selectValue} onChange={(ev) => intents.selectVideoSource(ev.target.value)}>
      {deviceOptNodes}
    </select>
  </div>
  )
};

function render(state, mountpoint) {
  return ReactDOM.render(
    <VideoInSelect activedevice={state.activesource} alldevices={state.allsources}
      activestats={state.activeinstats} />,
  mountpoint);
};


module.exports = {
  render: render
};
