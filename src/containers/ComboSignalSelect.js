import { connect } from 'react-redux';
// import { setValidAudioSource, setAudioSourceDevice, setAllAudioSources } from '../actions/audio'
import Select from '../components/Select.js'
import { createSelector } from 'reselect'


const getComboSignalMeta = state => state.signal.comboSignalMeta
const getComboSignalOptDict = createSelector(
  [ getComboSignalMeta ],
  (comboSignalMeta) => {
    const optDict = {}
    let keys = Array.from(Object.keys(comboSignalMeta)).sort();
    for (let key of keys) {
      optDict[key] = (
        comboSignalMeta[key].owner
        + '/'
        + comboSignalMeta[key].name
      )
    }
    return optDict
  }
)

const mapStateToProps = (state, {sinkControlKey, onSignalChange}) => {
  const signalMeta = state.signal.comboSignalMeta
  const optDict = {}

  return {
    optDict: getComboSignalOptDict(state),
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
