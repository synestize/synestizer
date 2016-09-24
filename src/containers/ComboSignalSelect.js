import { connect } from 'react-redux';
// import { setValidAudioSource, setAudioSourceDevice, setAllAudioSources } from '../actions/audio'
import Select from '../components/Select.js'

const mapStateToProps = (state, {sinkControlKey, onSignalChange}) => {
  const signalMeta = state.signal.comboSignalMeta
  const optDict = {}
  let keys = Array.from(Object.keys(signalMeta)).sort();
  for (let key of keys) {
    optDict[key] = signalMeta[key].owner + '/' + signalMeta[key].name
  }

  return {
    optDict,
    currentOpt: (state.audio.sinkControls[sinkControlKey] || {}).signal,
    // NB this is a dispatcher - should move it
    onChange: (key) => onSignalChange(key)
  }
};
const mapDispatchToProps = (dispatch, {sinkControlKey, onSignalChange}) => {
  return {
  }
};

const ComboSignalSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)( Select );

export default ComboSignalSelect;
