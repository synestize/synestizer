'use strict';
import { connect } from 'react-redux';
import { addSourceSignal,
  removeSourceSignal,
  setSourceSignalValue,
  setAllSourceSignalValues,
  addSinkSignal,
  removeSinkSignal,
  setSinkSignalValue,
  setAllSinkSignalValues,
  setSourceSinkScale,
  setSinkBias,
} from '../actions/signal'

import PatchMappingControl from '../components/PatchMappingControl.js'

const mapStateToProps = (state, {sourceKey, sinkKey, ...ownProps}) => {
  return {
    val: state.signal.sourceSinkScale[sourceKey+'/'+sinkKey],
    ...ownProps
  }
}
const mapDispatchToProps = (dispatch, {sourceKey, sinkKey}) => {
  return {
    onSetScale: (val=0) => dispatch(
      setSourceSinkScale(sourceKey, sinkKey, val)
    ),
  }
};

const ActivePatchMappingControl = connect(
  mapStateToProps,
  mapDispatchToProps
)( PatchMappingControl );

export default ActivePatchMappingControl;
