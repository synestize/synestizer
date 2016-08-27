import { connect } from 'react-redux';
// import { setValidAudioSource, setAudioSourceDevice, setAllAudioSources } from '../actions/audio'
import Select from '../components/Select.js'

const mapStateToProps = (state, {sinkControlKey, onSignalChange}) => {
  console.debug('franq', state.audio.sinkControlSignals, state.audio.sinkControls[sinkControlKey])
  return {
    optDict: state.audio.sinkControlSignals,
    currentOpt: sinkControlKey,
    onChange: (key) => onSignalChange(key) // NB this is a dispatcher
  }
};
const mapDispatchToProps = (dispatch, {sinkControlKey, onSignalChange}) => {
  return {
  }
};

const AudioSourceDeviceSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)( Select );

export default AudioSourceDeviceSelect;
