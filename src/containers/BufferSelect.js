import { connect } from 'react-redux';
// import { setValidAudioSource, setAudioSourceDevice, setAllAudioSources } from '../actions/audio'
import Select from '../components/Select.js'

const mapStateToProps = (state, {
    withNull=false,
    currentOpt,
    onChange}) => {
    const optDict = {}
    let keys = Array.from(Object.keys(state.audio.sampleBank)).sort();
    for (let key of keys) {
      optDict[key] =  state.audio.sampleBank[key].name
    }

  return {
    optDict,
    currentOpt,
    onChange,
    withNull,
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

const BufferSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)( Select );

export default BufferSelect;
