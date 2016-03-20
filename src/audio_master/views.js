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
  return (<div className="streamcontrol mastergain">
    <label htmlFor="masterGainSlider">Master Gain </label><input id="masterGainSlider" type="range" value={props.mastergain} onChange={(ev) => intents.setMasterGain(ev.target.value)} min="-40" max="6" step="1" /><span> {props.mastergain}</span>
  </div>)
};
var GenericAudioParam = function(props) {
  return (<div className="streamcontrol">
    <input type="range" value={props.mag} onChange={(ev) => intents.setMappingMag(props.sourceName, props.sinkName, ev.target.value)} min="0" max="2" step="any" onDoubleClick={(ev) => {
      intents.setMappingSign(props.sourceName, props.sinkName, props.sign*-1)
  }} />
  </div>)
};

function render(state, mountpoint) {
  let childComponents = [];
  
  return ReactDOM.render(
    <SynthControls mastergain={state.mastergain}> </SynthControls>,
    mountpoint
  );
};
module.exports = {
  GenericAudioParam: GenericAudioParam,
  render: render,
};
