'use strict';

var ReactDOM = require('react-dom');

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
function render(state, mountpoint, models) {
  let childComponents = [];
  
  return ReactDOM.render(
    <SynthControls state={state}> </SynthControls>,
    mountpoint
  );
};
module.exports = {
  render: render,
};
