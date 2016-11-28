import { connect } from 'react-redux';
import { resetToNothing } from '../actions/gui';
import RecordWidget from '../components/RecordWidget';

const mapStateToProps = (state, ownProps) => {
  return {
    text: 'NUKE'
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(resetToNothing())
    }
  }
};

const ActiveRecordWidget = connect(
  mapStateToProps,
  mapDispatchToProps
)( RecordWidget );

export default ActiveRecordWidget;
