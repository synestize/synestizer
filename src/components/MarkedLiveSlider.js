import React, { Component, PropTypes, Children } from 'react';

const MarkedLiveSlider = ({
    value,
    onChange,
    step="any",
    className="",
    shadowVal,
    disabled=false,
    min=-1,
    max=1,
  }) => {
  let shadowValDisplay;
  if (shadowVal!==undefined) {
    let divStyle = {
      width: bipolPerc(actual || 0.0)+"%"
    };
    shadowValDisplay = (<div className="shadow-state-bar"
      style={divStyle} />)
  }
  return (
    <div key="uniqueKey" className={className + " labeled-slider-wrap"}>

      <input className="slider scale"
        type="range"
        value={value}
        onChange={(ev)=>onChange(parseFloat(ev.target.value))}
        min={min} max={max} step={step}
        disabled={disabled} />
      {shadowValDisplay}
    </div>
  )
}

MarkedLiveSlider.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  shadowVal: PropTypes.number,
  disabled: PropTypes.bool,
}

export default MarkedLiveSlider;
