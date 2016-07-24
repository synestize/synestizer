'use strict';
import { connect } from 'react-redux';
import { setValidMidiSourceDevice, setMidiSourceDevice, setAllMidiSourceDevices, setMidiSourceChannel, removeMidiSourceCC, addMidiSourceCC, addUnknownMidiSourceCC } from '../actions/midi'
import MidiStreamSettings from '../components/MidiStreamSettings.js'

const mapStateToProps = (state, ownProps) => {
  return {
    currentChannel: state.midi.midiSourceChannel,
    deviceMap: state.__volatile.midi.midiSources,
    valid: state.__volatile.midi.validMidiSource,
    currentDevice: state.midi.midiSourceDevice,
    ccset: state.midi.midiSourceCCs,
    ccadder: addMidiSourceCC,
    ccremover: removeMidiSourceCC,
    ccunknownadder: addUnknownMidiSourceCC,
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChannelChange: (ev) => dispatch(setMidiSourceChannel(ev)),
    onDeviceChange: (key) => dispatch(setMidiSourceDevice(key)),
  }
};

const MidiSourceSection = connect(
  mapStateToProps,
  mapDispatchToProps
)( MidiStreamSettings );

export default MidiSourceSection;
