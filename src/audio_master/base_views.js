'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var intents = require('./intents');
var transform = require('../lib/transform');

var MasterGain = function({value, action}) {
  return (<div className="param-control mastergain">
    <label className="label" htmlFor="master-gain-slider">
      Gain
    </label>
    <div className="slider-wrap">
      <input className="slider value"
        id="master-gain-slider"
        type="range"
        value={value}
        onChange={(ev)=>action(ev.target.value)}
        min="-40" max="6" step="1" />
    </div>
    <span className="mapped-value">{value} dB</span>
  </div>)
};
var GenericAudioParam = function({median, perturbation, actual, address, label, action}) {
  //console.debug("Styleface", actual, transform.bipolPerc(actual || 0.0));
  let divStyle = {
    width: transform.bipolPerc(actual || 0.0)+"%"
  };
  return (<div className={"param-control " + address} >
    <label className="label"
      htmlFor={address + "-slider"}>
      {label}
    </label>
    <div className="slider-wrap">
      <input className="slider value"
        id={address + "-slider"}
        type="range"
        value={median}
        onChange={(ev)=>action(ev.target.value)}
        min="-1" max="1" step="any" />
      <div className="state-bar"
        id={address + "-slider-actual"}
        style={divStyle} />
    </div>
  </div>)
};

module.exports = {
  GenericAudioParam: GenericAudioParam,
  MasterGain: MasterGain,
};
