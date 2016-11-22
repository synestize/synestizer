import { connect } from 'react-redux';
import { load } from '../actions/app';
import FileWidget from '../components/FileWidget';

const mapStateToProps = (state, ownProps) => {
  return {
    text: 'Load'
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (f) => {
      dispatch(load(f))
    }
  }
};

const LoadWidget = connect(
  mapStateToProps,
  mapDispatchToProps
)( FileWidget );

export default LoadWidget;
