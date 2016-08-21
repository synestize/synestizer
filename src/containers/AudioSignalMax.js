'use strict';
import { connect } from 'react-redux';
import {
  setMaxNAudioSinkSignals
 } from '../actions/audio'
import IntSelect from '../components/IntSelect'

const mapStateToProps = (state, ownProps) => {
  return {
    currentNum: state.audio.nSinkControlSignals,
    maxNum: 21
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (i) => dispatch(setMaxNAudioSinkSignals(i))
  }
};

const AudioSignalMax = connect(
  mapStateToProps,
  mapDispatchToProps
)( IntSelect );

export default AudioSignalMax;
