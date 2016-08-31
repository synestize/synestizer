import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import LabeledSlider from '../components/LabeledSlider'

const GenericAudioParam = ({
  label,
  value,
  onChange,
  min=0,
  max=100,
  step="any",
  units="db",
}) => {

  return (<div className={"unmapped-param-control"} >
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

GenericAudioParam.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  units: PropTypes.string,
}

export default GenericAudioParam
