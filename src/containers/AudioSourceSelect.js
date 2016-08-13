'use strict';
import { connect } from 'react-redux';
import { setValidAudioSource, setCurrentAudioSource, setAllAudioSources } from '../actions/audio'
import DeviceSelect from '../components/DeviceSelect.js'

const mapStateToProps = (state, ownProps) => {
  return {
    deviceMap: state.__volatile.audio.audioSources,
    valid: state.__volatile.audio.validAudioSource,
    currentDevice: state.audio.currentAudioSource
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (key) => dispatch(setCurrentAudioSource(key))
  }
};

const AudioSourceSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)( DeviceSelect );

export default AudioSourceSelect;
