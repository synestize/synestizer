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
      median={props.medianMasterTempo}
      perturbation={props.perturbationMasterTempo}
      current={transform.perturb([
        props.medianMasterTempo,
        props.perturbationMasterTempo
      ])}
      action={intents.setMedianMasterTempo}
      />
  </div>)
};
var MasterGain = function({value, action}) {
  return (<div className="paramControl mastergain">
    <label className="paramLabel" htmlFor="masterGainSlider">
      Master Gain
    </label>
    <input className="paramSlider" id="masterGainSlider" type="range" value={value} onChange={(ev)=>action(ev.target.value)} min="-40" max="6" step="1" className="paramValue" />
    <span>{value}</span>
  </div>)
};
var GenericAudioParam = function({median, perturbation, current, address, label, action}) {
  return (<div className="paramControl {address}">
    <label className="paramLabel"
      htmlFor={address + "-slider"}>
      {label}
    </label>
    <input className="paramSlider"
      id={address + "-slider"}
      type="range"
      value={median}
      onChange={(ev)=>action(ev.target.value)}
      min="-1" max="1" step="any"
      className="paramValue" />
    <span>{current}</span>
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
