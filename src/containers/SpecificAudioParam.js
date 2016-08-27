import { connect } from 'react-redux';
import GenericAudioParam from '../components/GenericAudioParam.js'
import {
  setAudioSinkControlBias,
  setAudioSinkControlScale,
  setAudioSinkControlSignal
} from '../actions/audio';
/* bias,
  perturbation,
  actual,
  address,
  label,
  action
  */

const mapStateToProps = (state, {sinkControlKey}) => {
  return {...state.audio.sinkControls[sinkControlKey], sinkControlKey}
};

const mapDispatchToProps = (dispatch, {sinkControlKey}) => {
  return {
    onBiasChange: (val) => {
      dispatch(setAudioSinkControlBias(sinkControlKey, parseFloat(val)))
    },
    onScaleChange: (val) => {
      dispatch(setAudioSinkControlScale(sinkControlKey, parseFloat(val)))
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
