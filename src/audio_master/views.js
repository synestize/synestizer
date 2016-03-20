'use strict';

var React = require('react');
var ReactDOM = require('react-dom');

var SynthControls = function(props) {
  return (<div className="streamcontrolset">
    <h2>Synth Controls go here</h2>
  </div>)
};
var PerturbedSlider = function(props) {
  return (<div className="streamcontrol">
    <input className="mag" type="range" value={props.mag} onChange={(ev) => intents.setMappingMag(props.sourceName, props.sinkName, ev.target.value)} min="0" max="2" step="any" onDoubleClick={(ev) => {
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
  render: render,
};
