'use strict';

/* TODO:
 * Mute control
 * master gain
 * output compressor
 */

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
