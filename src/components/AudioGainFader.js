import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import LabeledSlider from '../components/LabeledSlider'
import MuteButton from '../components/MuteButton'

const AudioGainFader = ({
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
    <MuteButton mute={mute} onClick={onChangeMute} />
  </div>)
};

AudioGainFader.propTypes = {
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

export default AudioGainFader
