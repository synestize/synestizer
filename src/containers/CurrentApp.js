'use strict';
import { connect } from 'react-redux';
import App from '../components/App';
import {setPane} from '../actions';

const mapStateToProps = (state) => {
  return {
    panId: state.panId
  }
};
const mapDispatchToProps = (dispatch) => {
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
