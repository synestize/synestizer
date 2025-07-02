import React from 'react';
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

  return (<div className={"generic-audio-widget audio-master-gain"} >
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


export default AudioGainFader
