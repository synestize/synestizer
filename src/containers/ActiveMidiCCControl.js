import { connect } from 'react-redux';
import MidiCCControl from '../components/MidiCCControl.js'
import { union, difference, intersection } from '../lib/collections'

const mapStateToProps = (state, ownProps) => {
  return {
    currentNum: ownProps.cc,
    ccset: ownProps.ccset,
    soloed: ownProps.solocc===ownProps.cc
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const disp = {
    onChange: (ev) => {
      dispatch(ownProps.adder(ev))
      dispatch(ownProps.remover(ownProps.cc))
    },
    onDelete: () => {
      dispatch(ownProps.remover(ownProps.cc))
    },
  }
  if (typeof ownProps.solotoggler==='function') {
    disp.onSolo = () => {
      dispatch(ownProps.solotoggler(ownProps.cc))
    }
  }
  return disp
};

const ActiveMidiCCControl = connect(
  mapStateToProps,
  mapDispatchToProps
)( MidiCCControl );

export default ActiveMidiCCControl;
