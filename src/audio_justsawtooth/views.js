'use strict';
var React = require('react');
var ReactDOM = require('react-dom');

var Ensemble = function(props) {
  return (<div className="streamcontrolset">
    <h2>Sawtooth controls</h2>
  </div>)
};

function render(state, mountpoint) {
  let childComponents = [];
  
  return ReactDOM.render(
    <Ensemble state={state}> </Ensemble>,
    mountpoint
  );
};

module.exports = {
  render: render,
};
