import { connect } from 'react-redux';
import UnmappedAudioParam from '../components/UnmappedAudioParam.js'
import {
  setMasterTempo,
} from '../actions/audio';

const mapStateToProps = (state, ownProps) => {
  return {
    value: state.audio.master.tempo,
    label: "Tempo",
    min: 20,
    max: 5000,
    step: 1,
    units: "bpm"
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (val) => {
      dispatch(setMasterTempo(val))
    },
  }
};

const AudioMasterTempo = connect(
  mapStateToProps,
  mapDispatchToProps
)( UnmappedAudioParam );

export default AudioMasterTempo;
