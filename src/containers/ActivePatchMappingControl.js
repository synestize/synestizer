'use strict';
import { connect } from 'react-redux';
import { addSourceStream,
  removeSourceStream,
  setSourceStreamValue,
  setAllSourceStreamValues,
  addSinkStream,
  removeSinkStream,
  setSinkStreamValue,
  setAllSinkStreamValue,
  setSourceSinkScale,
  setSinkBias,
} from '../actions/stream'

import PatchMappingControl from '../components/PatchMappingControl.js'

const mapStateToProps = (state, ownProps) => {
  return {
    ...state.stream,
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (ev) => dispatch(setMidiSinkChannel(ev)),
  }
};

const ActivePatchMappingControl = connect(
  mapStateToProps,
  mapDispatchToProps
)( PatchMappingControl );

export default ActivePatchMappingControl;
