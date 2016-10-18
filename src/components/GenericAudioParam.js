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
    <h3 className="audio-sink-name">
      {label}
    </h3>
    <ArchimedeanSlider
      bias={bias}
      scale={scale}
      perturbedValue={actualSignalValue}
      perturb={actualSignalValue}
      className=''
      width={256}
      height={96}
      biasFill='brown'
      trackFill='gray'
      scaleArrowFill='blue'
      scaleBackingFill='black'
      perturbArrowFill='rgba(0,0,255,0.8)'
      biasThumbFill='black'
      tickColor='orange'
      biasBackingFill='white'
      binderColor='orange'
      transform=''
      actualColor='orange'
      onBiasDoubleClick={()=>null}
      onBiasChange={onBiasChange}
      onScaleDoubleClick={()=>null}
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
