'use strict';
import { connect } from 'react-redux';
import { setValidAudioSink, setAudioSinkDevice, setAllAudioSinks } from '../actions/audio'
import DeviceSelect from '../components/DeviceSelect.js'

const mapStateToProps = (state, ownProps) => {
  return {
    deviceMap: state.__volatile.audio.sinks,
    valid: state.__volatile.audio.validSink,
    currentDevice: state.audio.sinkDevice
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (key) => dispatch(setAudioSinkDevice(key))
  }
};

const AudioSinkDeviceSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)( DeviceSelect );

export default AudioSinkDeviceSelect;
