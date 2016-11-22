import { connect } from 'react-redux';
import { load } from '../actions/app';
import TextBlob from '../components/TextBlob';

const mapStateToProps = (state, ownProps) => {
  let persistentState = {...state}
  delete persistentState.__volatile
  return {
    title: 'SAVE ME',
    content: JSON.stringify(persistentState)
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (json) => {
      dispatch(load(json))
    }
  }
};

const AppStateWidget = connect(
  mapStateToProps,
  mapDispatchToProps
)( TextBlob );

export default AppStateWidget;
