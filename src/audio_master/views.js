'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var intents = require('./intents');

var SynthControls = function(props) {
  return (<div className="streamcontrolset">
    <h2>Master Controls</h2>
    <MasterVolume />
    <GenericAudioParam />
  </div>)
};
var MasterVolume = function(props) {
  return (<div className="streamcontrol">
    <input type="range" value={props.mag} onChange={(ev) => intents.setMappingMag(props.sourceName, props.sinkName, ev.target.value)} min="-40" max="6" step="any" onChange={(ev) => {
      intents.setMappingSign(props.sourceName, props.sinkName, props.sign*-1)
  }} />
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
    <SynthControls state={state}> </SynthControls>,
    mountpoint
  );
};
module.exports = {
  GenericAudioParam: GenericAudioParam,
  render: render,
};
