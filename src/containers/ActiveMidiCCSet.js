'use strict';
import { connect } from 'react-redux';
import MidiCCSet from '../components/MidiCCSelect.js'
import { union, difference, intersection } from '../lib/fakesetop'

const mapStateToProps = (state, ownProps) => {
  return {
    currentNum: state.midi.midiSourceChannel,
    name: 'midisourcecc',
    maxInt: 127,
    unavailable: difference(state.midi.midiSourceCCs, [ownProps.cc]),
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (ev) => {
      dispatch(ownProps.swapper(ownProps.cc, ev))
    },
    onDelete: () => {
      dispatch(ownProps.deleter(ownProps.cc))
    }
  }
};

const ActiveMidiCCSet = connect(
  mapStateToProps,
  mapDispatchToProps
)( IntSelect );

export default ActiveMidiCCSet;
