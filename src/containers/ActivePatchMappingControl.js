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

const mapStateToProps = (state, {sourceKey, sinkKey, ...ownProps}) => {
  return {
    val: state.stream.sourceSinkScale[sourceKey+'/'+sinkKey],
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
