import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import AnySignalSelect from '../containers/AnySignalSelect'
import MarkedLiveSlider from '../components/MarkedLiveSlider'

const GenericAudioParam = ({
  bias=0,
  scale=0,
  actual=0,
  signal="",
  sinkControlKey,
  actualSinkSignalValue,
  actualSinkControlValue,
  label,
  onBiasChange,
  onScaleChange,
  onSignalChange}) => {

  return (<div className={"param-control " + sinkControlKey} >
    <h3 className="audio-sink-name">
      {label}
    </h3>
    <AnySignalSelect
      className="any-signal-select"
      onSignalChange={onSignalChange}
      sinkControlKey={sinkControlKey} />
    <MarkedLiveSlider
      className="scale"
      onChange={onScaleChange}
      step={0.0625}
      labelText="scale"
      value={scale}
      shadowVal={actualSinkSignalValue}
      disabled={!Boolean(signal)}
    />
    <MarkedLiveSlider
      className="bias"
      onChange={onBiasChange}
      step={0.0625}
      labelText="bias"
      shadowVal={actualSinkControlValue}
      value={bias} />
  </div>)
};

GenericAudioParam.propTypes = {
  bias: PropTypes.number,
  scale: PropTypes.number,
  actual: PropTypes.number,
  sinkControlKey: PropTypes.string.isRequired,
  actualSinkSignalValue: PropTypes.number,
  actualSinkControlValue: PropTypes.number,
  signal: PropTypes.string,
  label: PropTypes.string.isRequired,
  onBiasChange: PropTypes.func.isRequired,
  onScaleChange: PropTypes.func.isRequired,
  onSignalChange: PropTypes.func.isRequired
}

export default GenericAudioParam
