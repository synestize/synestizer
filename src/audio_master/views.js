'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var intents = require('./intents');

var SynthControls = function(props) {
  return (<div className="streamcontrolset">
    <h2>Master Controls</h2>
    <MasterVolume mastergain={props.mastergain} />
    <GenericAudioParam />
  </div>)
};
var MasterVolume = function(props) {
  return (<div className="paramControl mastergain">
    <label className="paramLabel" htmlFor="masterGainSlider">
      Master Gain
    </label>
    <input className="paramSlider" id="masterGainSlider" type="range" value={props.mastergain} onChange={(ev) => intents.setMasterGain(ev.target.value)} min="-40" max="6" step="1" className="paramValue" />
    <span> {props.mastergain}</span>
  </div>)
};
var GenericAudioParam = function(props) {
  return (<div className="paramControl mastergain">
    <label className="paramLabel"
      htmlFor={props.paramAddress + "-slider"}>
      {props.paramLabel}
    </label>
    <input className="paramSlider"
      id={props.paramAddress + "-slider"}
      type="range"
      value={props.paramCentralValue}
      onChange={(ev) => props.intent(props.paramAddress, ev.target.value)}
      min="-1" max="1" step="any"
      className="paramValue" />
    <span>value</span>
  </div>)
};

function render(state, mountpoint) {
  let childComponents = [];
  
  return ReactDOM.render(
    <SynthControls
      mastergain={state.mastergain}
      params={state.params}
      intents={intents} />,
    mountpoint
  );
};
module.exports = {
  GenericAudioParam: GenericAudioParam,
  render: render,
};
