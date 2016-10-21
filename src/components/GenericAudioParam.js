import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import ComboSignalSelect from '../containers/ComboSignalSelect'
import ArchimedeanSlider from '../components/ArchimedeanSlider'

const GenericAudioParam = ({
  bias=0,
  scale=0,
  actual=0,
  signal="",
  sinkControlKey,
  actualSignalValue,
  actualSinkControlValue,
  label,
  onBiasChange,
  onScaleChange,
  onSignalChange}) => {
  return (<div className={"param-control " + sinkControlKey} >
    <ArchimedeanSlider
      bias={bias}
      scale={scale}
      perturbedValue={actualSignalValue}
      className=''
      width={220}
      height={60}
      label={label}
      biasFill='brown'
      trackColor='gray'
      scaleArrowFill='blue'
      scaleBackingFill='black'
      perturbArrowFill='rgba(0,0,255,0.8)'
      biasThumbFill='black'
      tickColor='red'
      biasBackingFill='white'
      binderColor='orange'
      transform=''
      actualColor='orange'
      onBiasDoubleClick={()=>onBiasChange(0.0)}
      onBiasChange={onBiasChange}
      onScaleDoubleClick={()=>onScaleChange(0.0)}
      onScaleChange={onScaleChange}
    />
    <ComboSignalSelect
      className="any-signal-select"
      onSignalChange={onSignalChange}
      sinkControlKey={sinkControlKey}
    />
  </div>)
};

GenericAudioParam.propTypes = {
  bias: PropTypes.number,
  scale: PropTypes.number,
  actual: PropTypes.number,
  sinkControlKey: PropTypes.string.isRequired,
  actualSignalValue: PropTypes.number,
  actualSinkControlValue: PropTypes.number,
  signal: PropTypes.string,
  label: PropTypes.string.isRequired,
  onBiasChange: PropTypes.func.isRequired,
  onScaleChange: PropTypes.func.isRequired,
  onSignalChange: PropTypes.func.isRequired
}

export default GenericAudioParam
