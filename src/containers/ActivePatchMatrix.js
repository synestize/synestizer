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

import PatchMatrix from '../components/PatchMatrix.js'

const mapStateToProps = (state, ownProps) => {
  return {

    ...state.stream,
  }
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChannelChange: (ev) => dispatch(setMidiSinkChannel(ev)),
    onDeviceChange: (key) => dispatch(setMidiSinkDevice(key)),
  }
};

const ActivePatchMatrix = connect(
  mapStateToProps,
  mapDispatchToProps
)( PatchMatrix );

export default ActivePatchMatrix;
