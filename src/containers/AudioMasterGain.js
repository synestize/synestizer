import { connect } from 'react-redux';
import UnmappedAudioParam from '../components/UnmappedAudioParam.js'
import {
  setMasterGain,
} from '../actions/audio';

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.audio.master.gain,
    label: "Gain",
    min: -60,
    max: 6,
    step: 1,
    level: state.__volatile.audio.level
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (val) => {
      dispatch(setMasterGain(val))
    },
  }
};

const AudioMasterGain = connect(
  mapStateToProps,
  mapDispatchToProps
)( UnmappedAudioParam );

export default AudioMasterGain;
