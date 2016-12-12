import { connect } from 'react-redux';
import { resetToDefault } from '../actions/app';
import Button from '../components/Button';

const mapStateToProps = (state, ownProps) => {
  return {
    text: 'randomize'
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(resetToDefault())
    }
  }
};

const RandomizeButton = connect(
  mapStateToProps,
  mapDispatchToProps
)( Button );

export default RandomizeButton;
