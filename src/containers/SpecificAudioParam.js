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
    onBiasChange: (ev) => {
      dispatch(setAudioSinkControlBias(sinkControlKey, parseFloat(ev)))
    },
    onScaleChange: (ev) => {
      dispatch(setAudioSinkControlScale(sinkControlKey, parseFloat(ev)))
    },
    onSignalChange: (ev) => {
      dispatch(setAudioSinkControlSignal(sinkControlKey, parseFloat(ev)))
    },
  }
};

const SpecificAudioParam = connect(
  mapStateToProps,
  mapDispatchToProps
)( GenericAudioParam );

export default SpecificAudioParam;
