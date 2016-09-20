import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import LabeledSlider from '../components/LabeledSlider'

const AudioMasterGain = ({
  label,
  gain,
  onChangeGain,
  onChangeMute,
  mute,
  min=0,
  max=100,
  step="any",
  units="db",
}) => {

  return (<div className={"unmapped-param-control audio-master-gain"} >
    <LabeledSlider
      uniqueKey={label+"unmappedcontrolthing"}
      className="unmapped-control"
      onChange={onChangeGain}
      min={min}
      max={max}
      step={step}
      labelText={label}
      value={gain} />
    <span className="unmapped-value">
      {gain}
    </span>
    <span className="unmapped-units">
      {units}
    </span>
    <span className={"mute button " + String(mute)} onClick={onChangeMute}>
      mute
    </span>
  </div>)
};

AudioMasterGain.propTypes = {
  gain: PropTypes.number.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  label: PropTypes.string.isRequired,
  onChangeGain: PropTypes.func.isRequired,
  onChangeMute: PropTypes.func.isRequired,
  mute: PropTypes.bool.isRequired,
  units: PropTypes.string,
}

export default AudioMasterGain