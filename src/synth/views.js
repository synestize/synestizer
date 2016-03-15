'use strict';

/* TODO:
 * Mute control
 * master gain
 * output compressor
 */

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var model = require('./models');
var intents = require('./intents');
var ensembles = require('./ensembles/main');

var SynthControls = function(props) {
  return (<div className="streamcontrolset">
    <h2>Synth Controls go here</h2>
  </div>)
};
var MasterVolumeControl = function(props) {
  return (<div className="streamcontrolset">
    <h2>Synth Controls go here</h2>
  </div>)
};
var MasterTempoControl = function(props) {
  return (<div className="streamcontrolset">
    <h2>Synth Controls go here</h2>
  </div>)
};
function render(state, mountpoint) {
  return ReactDOM.render(
    <SynthControls ensembles={ensembles} />,
    mountpoint);
};
module.exports = {
  render: render,
};
