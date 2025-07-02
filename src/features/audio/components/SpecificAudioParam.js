import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAudioSinkControlBias, setAudioSinkControlScale, setAudioSinkControlSignal } from '../audioSlice';
import ComboSignalSelect from '../../signal/components/ComboSignalSelect';
import ArchimedeanSlider from '../../../components/ArchimedeanSlider';

const SpecificAudioParam = ({ sinkControlKey }) => {
  const dispatch = useDispatch();
  
  const sinkControl = useSelector(state => state.audio.sinkControls[sinkControlKey] || {});
  const { bias = 0, scale = 0, signal = '', label } = sinkControl;
  
  const actualSignalValue = useSelector(state => 
    state.__volatile.signal.comboSignalValues[signal]
  );
  const actualSinkControlValue = useSelector(state => 
    state.__volatile.audio.sinkActualValues[sinkControlKey]
  );

  const handleBiasChange = (val) => {
    dispatch(setAudioSinkControlBias(sinkControlKey, val));
  };

  const handleScaleChange = (val) => {
    dispatch(setAudioSinkControlScale(sinkControlKey, val));
  };

  const handleSignalChange = (signalKey) => {
    dispatch(setAudioSinkControlSignal(sinkControlKey, signalKey));
  };

  return (
    <div className={`param-control ${sinkControlKey}`}>
      <ArchimedeanSlider
        bias={bias}
        scale={scale}
        perturbedValue={actualSinkControlValue}
        perturbation={actualSignalValue}
        className=""
        width={200}
        height={54}
        label={label}
        biasFill="brown"
        trackColor="gray"
        scaleArrowFill="blue"
        scaleBackingFill="black"
        biasThumbFill="black"
        tickColor="red"
        biasBackingFill="white"
        binderColor="orange"
        transform=""
        actualColor="orange"
        onBiasDoubleClick={() => handleBiasChange(0.0)}
        onBiasChange={handleBiasChange}
        onScaleDoubleClick={() => handleScaleChange(0.0)}
        onScaleChange={handleScaleChange}
      />
      <ComboSignalSelect
        className="any-signal-select"
        onSignalChange={handleSignalChange}
        sinkControlKey={sinkControlKey}
      />
    </div>
  );
};

export default SpecificAudioParam;