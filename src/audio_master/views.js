'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var intents = require('./intents');
var transform = require('../lib/transform');

var SynthControls = function(props) {
  return (<div className="audiocontrolset">
    <h2>Master Controls</h2>
    <MasterGain
      value={props.mastergain}
      action={intents.setMasterGain} />
    <GenericAudioParam
      label="Tempo"
      median={props.medianMasterTempo}
      perturbation={props.perturbationMasterTempo}
      actual={props.actualMasterTempo}
      action={intents.setMedianMasterTempo}
      address="master-tempo"
      />
  </div>)
};
var MasterGain = function({value, action}) {
  return (<div className="paramControl mastergain">
    <label className="paramLabel" htmlFor="masterGainSlider">
      Gain
    </label>
    <input className="paramSlider" id="masterGainSlider" type="range" value={value} onChange={(ev)=>action(ev.target.value)} min="-40" max="6" step="1" className="paramValue" />
    <span>{value}</span>
  </div>)
};
var GenericAudioParam = function({median, perturbation, actual, address, label, action}) {
  return (<div className="paramControl {address}">
    <label className="paramLabel"
      htmlFor={address + "-slider"}>
      {label}
    </label>
    <input className="paramSlider paramValue"
      id={address + "-slider"}
      type="range"
      value={median}
      onChange={(ev)=>action(ev.target.value)}
      min="-1" max="1" step="any" />
    <span>{actual.toFixed(2)}</span>
    <input className="paramSlider actual"
      id={address + "-slider-actual"}
      type="range"
      value={actual}
      min="-1" max="1" step="any"
      disabled={true} />
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
  GenericAudioParam: GenericAudioParam,
  render: render,
};
