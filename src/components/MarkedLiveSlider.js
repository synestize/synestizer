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
    shadowValDisplay = (<input
      className="shadow-slider "
      type="range"
      value={shadowVal}
      min={min} max={max} step={step}
      disabled={disabled} />)
  }
  return (
    <div className={className + " marked-slider-wrap"}>
      <input className="slider"
        type="range"
        value={value}
        onChange={(ev)=>onChange(parseFloat(ev.target.value))}
        min={min} max={max} step={step}
        disabled={disabled} />
      <div className="zero-mark"></div>
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
