'use strict';

var JustSawTooth = function(props) {
  return (<div className="streamcontrolset">
    <h2>Sawtooth controls</h2>
  </div>)
};

function render(state, mountpoint) {
  return ReactDOM.render(
    <JustSawTooth ensembles={ensembles} />,
    mountpoint);
};
module.exports = {
  render: render,
};
