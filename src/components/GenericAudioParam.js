import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'

const GenericAudioParam = ({
  bias=0,
  scale=0,
  actual=0,
  signal="",
  sinkControlKey,
  label,
  onBiasChange,
  onScaleChange,
  onSignalChange}) => {
  let divStyle = {
    width: bipolPerc(actual || 0.0)+"%"
  };
  return (<div className={"param-control " + sinkControlKey} >
    <label className="label"
      htmlFor={sinkControlKey + "-slider"}>
      {label}
    </label>
    <div className="slider-wrap">
      <input className="slider value"
        id={sinkControlKey + "-slider"}
        type="range"
        value={bias}
        onChange={(ev)=>onBiasChange(ev.target.value)}
        min="-1" max="1" step="any" />
      <div className="state-bar"
        id={sinkControlKey + "-slider-actual"}
        style={divStyle} />
    </div>
  </div>)
};

GenericAudioParam.propTypes = {
  bias: PropTypes.number,
  scale: PropTypes.number,
  actual: PropTypes.number,
  sinkControlKey: PropTypes.string.isRequired,
  signal: PropTypes.string,
  label: PropTypes.string.isRequired,
  onBiasChange: PropTypes.func.isRequired,
  onScaleChange: PropTypes.func.isRequired,
  onSignalChange: PropTypes.func.isRequired
}

export default GenericAudioParam
