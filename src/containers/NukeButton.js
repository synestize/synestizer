import { connect } from 'react-redux';
import { resetToNothing } from '../actions/gui';
import Button from '../components/Button';

const mapStateToProps = (state, ownProps) => {
  return {
    text: 'NUKE'
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(resetToNothing())
      window.location.reload()
    }
  }
};

const ResetButton = connect(
  mapStateToProps,
  mapDispatchToProps
)( Button );

export default ResetButton;
