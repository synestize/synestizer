import { connect } from 'react-redux';
// import { setValidAudioSource, setAudioSourceDevice, setAllAudioSources } from '../actions/audio'
import Select from '../components/Select.js'

const mapStateToProps = (state, {sinkControlKey, onSignalChange}) => {
  console.debug('franq', state.audio.sinkControlSignals, state.audio.sinkControls[sinkControlKey])
  return {
    optDict: state.__volatile.audio.sources,
    currentOpt: state.audio.sourceDevice
  }
};
const mapDispatchToProps = (dispatch, {sinkControlKey, onSignalChange}) => {
  return {
    onChange: (key) => onSignalChange(key)
  }
};

const AudioSourceDeviceSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)( Select );

export default AudioSourceDeviceSelect;
