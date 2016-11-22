import { connect } from 'react-redux';
import { load } from '../actions/app';
import FileWidget from '../components/FileWidget';

const mapStateToProps = (state, ownProps) => {
  return {
    text: 'NUKE'
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: () => {
      dispatch(load())
    }
  }
};

const LoadWidget = connect(
  mapStateToProps,
  mapDispatchToProps
)( FileWidget );

export default LoadWidget;
