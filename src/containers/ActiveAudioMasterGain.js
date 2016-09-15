import { connect } from 'react-redux';
import AudioMasterGain from '../components/AudioMasterGain.js'
import {
  setMasterGain,
  toggleMasterMute,
} from '../actions/audio';

const mapStateToProps = (state, ownProps) => {
  return {
    gain: state.audio.master.gain,
    mute: state.audio.master.mute,
    label: "Gain",
    min: -60,
    max: 6,
    step: 1,
    level: state.__volatile.audio.level
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChangeGain: (val) => {
      dispatch(setMasterGain(val))
    },
    onChangeMute: (val) => {
      dispatch(toggleMasterMute(!ownProps.mute))
    },
  }
};

const ActiveAudioMasterGain = connect(
  mapStateToProps,
  mapDispatchToProps
)( AudioMasterGain );

export default ActiveAudioMasterGain;
