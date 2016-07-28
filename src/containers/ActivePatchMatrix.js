'use strict';
import { connect } from 'react-redux';
import { addSourceSignal,
  removeSourceSignal,
  setSourceSignalValue,
  setAllSourceSignalValues,
  addSinkSignal,
  removeSinkSignal,
  setSinkSignalValue,
  setAllSinkSignalValue,
  setSourceSinkScale,
  setSinkBias,
} from '../actions/signal'

import PatchMatrix from '../components/PatchMatrix.js'

const mapStateToProps = (state, ownProps) => {
  return {
    ...state.signal,
  }
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

const ActivePatchMatrix = connect(
  mapStateToProps,
  mapDispatchToProps
)( PatchMatrix );

export default ActivePatchMatrix;
