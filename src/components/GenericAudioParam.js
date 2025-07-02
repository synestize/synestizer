import React from 'react';
import {bipolPerc} from '../lib/transform'
import ComboSignalSelect from '../features/signal/components/ComboSignalSelect'
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
      perturbedValue={actualSinkControlValue}
      perturbation={actualSignalValue}
      className=''
      width={200}
      height={54}
      label={label}
      biasFill='brown'
      trackColor='gray'
      scaleArrowFill='blue'
      scaleBackingFill='black'
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


export default GenericAudioParam
