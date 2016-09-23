import { connect } from 'react-redux';
import { reset } from '../actions/gui';
import Button from '../components/Button';

const mapStateToProps = (state, ownProps) => {
  return {
    text: 'Reset'
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(reset())
    }
  }
};

const ResetButton = connect(
  mapStateToProps,
  mapDispatchToProps
)( Button );

export default ResetButton;
