'use strict';

var Ensemble = function(props) {
  return (<div className="streamcontrolset">
    <h2>Sawtooth controls</h2>
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
