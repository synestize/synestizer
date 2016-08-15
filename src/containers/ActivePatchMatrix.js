'use strict';
import { connect } from 'react-redux';

import PatchMatrix from '../components/PatchMatrix.js'

const mapStateToProps = (state, ownProps) => {
  return {
    ...state.signal,
    ...state.__volatile.signal
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
