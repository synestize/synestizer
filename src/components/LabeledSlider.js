import React from 'react';

const LabeledSlider = ({
    uniqueKey,
    value,
    labelText,
    onChange,
    step="any",
    className="",
    disabled=false,
    min=-1,
    max=1,
  }) => {
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
    </div>
  )
}


export default LabeledSlider;
