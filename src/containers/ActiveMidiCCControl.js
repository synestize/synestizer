import { connect } from 'react-redux';
import MidiCCControl from '../components/MidiCCControl.js'
import { union, difference, intersection } from '../lib/fakesetop'

const mapStateToProps = (state, ownProps) => {
  return {
    currentNum: ownProps.cc,
    ccset: ownProps.ccset
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (ev) => {
      dispatch(ownProps.swapper(ownProps.cc, ev))
    },
    onDelete: () => {
      dispatch(ownProps.remover(ownProps.cc))
    }
  }
};

const ActiveMidiCCControl = connect(
  mapStateToProps,
  mapDispatchToProps
)( MidiCCControl );

export default ActiveMidiCCControl;
