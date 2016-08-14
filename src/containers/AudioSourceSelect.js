'use strict';
import { connect } from 'react-redux';
import { setValidAudioSource, setAudioSourceDevice, setAllAudioSources } from '../actions/audio'
import DeviceSelect from '../components/DeviceSelect.js'

const mapStateToProps = (state, ownProps) => {
  return {
    deviceMap: state.__volatile.audio.sources,
    valid: state.__volatile.audio.validSource,
    currentDevice: state.audio.sourceDevice
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (key) => dispatch(setAudioSourceDevice(key))
  }
};

const AudioSourceSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)( DeviceSelect );

export default AudioSourceSelect;
