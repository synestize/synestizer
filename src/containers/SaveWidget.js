import { connect } from 'react-redux';
import { save } from '../actions/app';
import FileWidget from '../components/FileWidget';

const mapStateToProps = (state, ownProps) => {
  return {
    text: 'Save'
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (f) => {
      dispatch(save(f))
    }
  }
};

const SaveWidget = connect(
  mapStateToProps,
  mapDispatchToProps
)( FileWidget );

export default SaveWidget;
