'use strict';
import { connect } from 'react-redux';
import App from '../components/App';
import {setPane} from '../actions';

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
)( App );

export default CurrentApp;
