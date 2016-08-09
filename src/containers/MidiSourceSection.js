'use strict';
import { connect } from 'react-redux';
import { setValidMidiSourceDevice, setMidiSourceDevice, setAllMidiSourceDevices, setMidiSourceChannel, removeMidiSourceCC, addMidiSourceCC, addUnknownMidiSourceCC } from '../actions/midi'
import MidiStreamSettings from '../components/MidiStreamSettings.js'

const mapStateToProps = (state, ownProps) => {
  return {
    currentChannel: state.midi.sourceChannel,
    deviceMap: state.__volatile.midi.sources,
    valid: state.__volatile.midi.validSource,
    currentDevice: state.midi.sourceDevice,
    ccset: state.midi.sourceCCs,
    ccadder: addMidiSourceCC,
    ccremover: removeMidiSourceCC,
    ccunknownadder: addUnknownMidiSourceCC,
    title: 'Midi In',
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
