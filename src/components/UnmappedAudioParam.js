import React from 'react';
import {bipolPerc} from '../lib/transform'
import LabeledSlider from '../components/LabeledSlider'

const UnmappedAudioParam = ({
  label,
  value,
  onChange,
  min=0,
  max=100,
  step="any",
  units="db",
}) => {

  return (<div className={"generic-audio-widget"} >
    <LabeledSlider
      uniqueKey={label+"unmappedcontrolthing"}
      className="unmapped-control"
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      labelText={label}
      value={value} />
    <span className="unmapped-value">
      {value}
    </span>
    <span className="unmapped-units">
      {units}
    </span>
  </div>)
};


export default UnmappedAudioParam
