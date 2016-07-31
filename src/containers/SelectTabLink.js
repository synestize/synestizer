'use strict';
import { connect } from 'react-redux';
import Link from '../components/Link';
import { setVisiblePane } from '../actions/gui';

const mapStateToProps = (state, ownProps) => {
  return {
    active: (state.gui.visiblePane == ownProps.paneId),
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(setVisiblePane(ownProps.paneId))
    }
  }
};

const SelectTabLink = connect(
  mapStateToProps,
  mapDispatchToProps
)( Link );

export default SelectTabLink;
