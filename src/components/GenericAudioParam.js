import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import AudioSinkSignalSelect from '../containers/AudioSinkSignalSelect'
import LabeledSlider from '../components/LabeledSlider'

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

  return (<div className={"param-control " + sinkControlKey} >
    <h3 className="audio-sink-name">
      {label}
    </h3>
    <AudioSinkSignalSelect
      className="audio-sink-signal-select"
      onSignalChange={onSignalChange}
      sinkControlKey={sinkControlKey} />
    <LabeledSlider
      uniqueKey={sinkControlKey+"-scale-slider"}
      className="scale"
      onChange={onScaleChange}
      step={0.0625}
      labelText="scale"
      value={scale} />
    <LabeledSlider
      uniqueKey={sinkControlKey+"-bias-slider"}
      className="bias"
      onChange={onBiasChange}
      step={0.0625}
      labelText="bias"
      value={bias} />
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
