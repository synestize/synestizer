import { connect } from 'react-redux';
import { load } from '../actions/app';
import TextBlob from '../components/TextBlob';

const mapStateToProps = (state, ownProps) => {
  let persistentState = {...state}
  delete persistentState.__volatile
  return {
    title: 'DNA',
    content: JSON.stringify(persistentState),
    className: 'dna',
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (serialized) => {
      dispatch(load(serialized))
    }
  }
};

const AppStateWidget = connect(
  mapStateToProps,
  mapDispatchToProps
)( TextBlob );

export default AppStateWidget;
