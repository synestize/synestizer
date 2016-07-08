import { connect } from 'react-redux';
import MidiCCControl from '../components/MidiCCControl.js'
import { union, difference, intersection } from '../lib/fakesetop'

const mapStateToProps = (state, ownProps) => {
  return {
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAdd: (ev) => {
      dispatch(ownProps.adder(ownProps.cc, ev))
    },
  }
};

const ActiveMidiCCControl = connect(
  mapStateToProps,
  mapDispatchToProps
)( MidiCCControl );

export default ActiveMidiCCControl;
