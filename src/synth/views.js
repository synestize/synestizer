'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var model = require('./models');
var intents = require('./intents');

var SynthControls = function(props) {
  return (<div className="streamcontrolset">
    <h2>Synth Controls go here</h2>
  </div>)
};
function render(state, mountpoint) {
  return ReactDOM.render(
    <SynthControls activedevice={state.activeoutdevice} alldevices={state.alloutdevices} />,
    mountpoint);
};
module.exports = {
  render: render,
};
