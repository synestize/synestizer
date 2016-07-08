import { connect } from 'react-redux';
import MidiCCControl from '../components/MidiCCControl.js'
import { union, difference, intersection } from '../lib/fakesetop'

const mapStateToProps = (state, ownProps) => {
  return {
    currentNum: ownProps.cc,
    unavailable: difference(ownProps.ccset, [ownProps.cc]),
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
