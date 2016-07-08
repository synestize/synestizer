'use strict';
import { connect } from 'react-redux';
import { setValidMidiSourceDevice, setCurrentMidiSourceDevice, setAllMidiSourceDevices, setMidiSourceChannel, swapMidiSourceCC, setMidiSourceCCs, removeMidiSourceCC, addMidiSourceCC } from '../actions/midi'
import MidiStreamSettings from '../components/MidiStreamSettings.js'

const mapStateToProps = (state, ownProps) => {
  return {
    currentChannel: state.midi.midiSourceChannel,
    deviceMap: state.__volatile.midi.midiSources,
    valid: state.__volatile.midi.validMidiSource,
    currentDevice: state.midi.currentMidiSource,
    ccset: state.midi.midiSourceCCs,
    ccadder: addMidiSourceCC,
    ccswapper: swapMidiSourceCC,
    ccremover: removeMidiSourceCC,
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChannelChange: (ev) => dispatch(setMidiSourceChannel(ev)),
    onDeviceChange: (key) => dispatch(setCurrentMidiSourceDevice(key)),
  }
};

const MidiSourceSection = connect(
  mapStateToProps,
  mapDispatchToProps
)( MidiStreamSettings );

export default MidiSourceSection;