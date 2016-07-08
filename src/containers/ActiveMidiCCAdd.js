import { connect } from 'react-redux';
import Add from '../components/Add.js'

const mapStateToProps = (state, ownProps) => {
  return {
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onClick: () => {
      dispatch(ownProps.adder())
    }
  }
};

const ActiveMidiCCAdd = connect(
  mapStateToProps,
  mapDispatchToProps
)( Add );

export default ActiveMidiCCAdd;
