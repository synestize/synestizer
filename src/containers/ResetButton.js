import { connect } from 'react-redux';
import { resetToDefault } from '../actions/gui';
import Button from '../components/Button';

const mapStateToProps = (state, ownProps) => {
  return {
    text: 'reset'
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(resetToDefault())
    }
  }
};

const ResetButton = connect(
  mapStateToProps,
  mapDispatchToProps
)( Button );

export default ResetButton;