import { connect } from 'react-redux';
import Link from '../components/Link';
import { setVisiblePane } from '../features/gui/guiSlice';

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
