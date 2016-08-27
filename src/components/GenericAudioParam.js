import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import AudioSinkSignalSelect from '../containers/AudioSinkSignalSelect'

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
    {label}
    <AudioSinkSignalSelect
      onSignalChange={onSignalChange}
      sinkControlKey={sinkControlKey} />
    <div className="scale-slider-wrap">
      <label className="label"
        htmlFor={sinkControlKey + "-scale-slider"}>
        scale
      </label>
      <input className="slider scale"
        id={sinkControlKey + "-scale-slider"}
        type="range"
        value={scale}
        onChange={(ev)=>onScaleChange(ev.target.value)}
        min="-1" max="1" step="0.0625" />
    </div>
    <label className="label"
      htmlFor={sinkControlKey + "-bias-slider"}>
      Value
    </label>
    <div className="bias-slider-wrap">
      <input className="slider bias"
        id={sinkControlKey + "-bias-slider"}
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
