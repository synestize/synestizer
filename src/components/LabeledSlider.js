import React, { Component, PropTypes, Children } from 'react';

const LabeledSlider = ({
    uniqueKey,
    value,
    labelText,
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
      id={sinkControlKey + "-slider-actual"}
      style={divStyle} />)
  }
  return (
    <div key="uniqueKey" className={className + " labeled-slider-wrap"}>
      <label className={"label" + (disabled ? " disabled": "") }
        htmlFor={uniqueKey + "-slider"}>
        {labelText}
      </label>
      <input className="slider scale"
        id={uniqueKey + "-slider"}
        type="range"
        value={value}
        onChange={(ev)=>onChange(parseFloat(ev.target.value))}
        min={min} max={max} step={step}
        disabled={disabled} />
      {shadowValDisplay}
    </div>
  )
}

LabeledSlider.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  className: PropTypes.string,
  labelText: PropTypes.string.isRequired,
  uniqueKey: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  shadowVal: PropTypes.number,
  disabled: PropTypes.bool,
}

export default LabeledSlider;
