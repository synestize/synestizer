'use strict';
import { connect } from 'react-redux';
import DeviceSelect from '../components/DeviceSelect';
import { setValidVideoSource, setCurrentVideoSource, setAllVideoSources } from './actions'

const mapStateToProps = (state, ownProps) => {
  return {
    panId: state.panId
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setPane: (paneId) => {
      dispatch(setPane(paneId))
    }
  }
};

const CurrentApp = connect(
  mapStateToProps,
  mapDispatchToProps,
  undefined, //mergeprops
  {
    withRef: true // enable .getWrappedInstance() for Component hackin'
  }
)( App );

export default CurrentApp;
