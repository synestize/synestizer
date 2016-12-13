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
  // console.debug('combosignalselect', getComboSignalOptDict(state))
  return {
    optDict: getComboSignalOptDict(state),
    currentOpt: (state.audio.sinkControls[sinkControlKey] || {}).signal,
    // NB this is a dispatcher - should move it
    onChange: onSignalChange
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
