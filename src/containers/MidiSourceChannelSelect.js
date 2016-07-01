'use strict';
import { connect } from 'react-redux';
import { setMidiSourceChannel } from '../actions/midi'
import IntSelect from '../components/IntSelect.js'

const mapStateToProps = (state, ownProps) => {
  return {
    currentInt: state.midi.midiSourceChannel,
    name: 'midisource',
    maxInt: 127,
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (ev) => {
      dispatch(setMidiSourceChannel(parseInt(ev)))
    }
  }
};

const MidiSourceChannelSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)( IntSelect );

export default MidiSourceChannelSelect;
