import { connect } from 'react-redux';
import { randomize } from '../actions/app';
import Button from '../components/Button';

const mapStateToProps = (state, ownProps) => {
  return {
    text: 'randomize'
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(randomize())
    }
  }
};

const RandomizeButton = connect(
  mapStateToProps,
  mapDispatchToProps
)( Button );

export default RandomizeButton;
