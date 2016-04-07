'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var intents = require('./intents');
var transform = require('../lib/transform');
var base_views = require('./base_views');

var SynthControls = function(props) {
  return (<div className="audiocontrolset">
    <MasterGain
      value={props.masterGain}
      action={intents.setMasterGain} />
    <GenericAudioParam
      label="Tempo"
      median={props.medianMasterTempo}
      perturbation={props.perturbationMasterTempo}
      actual={props.actualMasterTempo}
      action={intents.setMedianMasterTempo}
      address="master-tempo"
      />
    <GenericAudioParam
      label="Base F"
      median={props.medianBaseFreq}
      perturbation={props.perturbationBaseFreq}
      actual={props.actualBaseFreq}
      action={intents.setMedianBaseFreq}
      address="base-freq"
      />
  </div>)
};
function render(state, mountpoint) {
  let childComponents = [];
  
  return ReactDOM.render(
    <SynthControls {...state} />,
    mountpoint
  );
};
module.exports = {
  render: render,
};
