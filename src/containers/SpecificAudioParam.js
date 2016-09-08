import { connect } from 'react-redux';
import GenericAudioParam from '../components/GenericAudioParam.js'
import {
  setAudioSinkControlBias,
  setAudioSinkControlScale,
  setAudioSinkControlSignal
} from '../actions/audio';

const mapStateToProps = (state, {sinkControlKey}) => {
  let sinkSignalKey = state.audio.sinkControls[sinkControlKey].signal;
  return {
    ...state.audio.sinkControls[sinkControlKey],
    sinkControlKey,
    actualSinkSignalValue: state.__volatile.signal.sinkSignalValues[sinkSignalKey],
    actualSinkControlValue: state.__volatile.audio.sinkActualValues[sinkControlKey]
  }
};

const mapDispatchToProps = (dispatch, {sinkControlKey}) => {
  return {
    onBiasChange: (val) => {
      dispatch(setAudioSinkControlBias(sinkControlKey, val))
    },
    onScaleChange: (val) => {
      dispatch(setAudioSinkControlScale(sinkControlKey, val))
    },
    onSignalChange: (sinkSignalKey) => {
      dispatch(setAudioSinkControlSignal(sinkControlKey, sinkSignalKey))
    },
  }
};

const SpecificAudioParam = connect(
  mapStateToProps,
  mapDispatchToProps
)( GenericAudioParam );

export default SpecificAudioParam;
