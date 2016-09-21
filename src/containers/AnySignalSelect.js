import { connect } from 'react-redux';
// import { setValidAudioSource, setAudioSourceDevice, setAllAudioSources } from '../actions/audio'
import Select from '../components/Select.js'

const mapStateToProps = (state, {sinkControlKey, onSignalChange}) => {
  return {
    optDict: state.audio.sinkControlSignals,
    currentOpt: (state.audio.sinkControls[sinkControlKey] || {}).signal,
    onChange: (key) => onSignalChange(key) // NB this is a dispatcher
  }
};
const mapDispatchToProps = (dispatch, {sinkControlKey, onSignalChange}) => {
  return {
  }
};

const AnySignalSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)( Select );

export default AnySignalSelect;
