'use strict';
import { connect } from 'react-redux';
import { setValidMidiSinkDevice, setMidiSinkDevice, setAllMidiSinkDevices, setMidiSinkChannel, swapMidiSinkCC, setMidiSinkCCs, removeMidiSinkCC, addMidiSinkCC } from '../actions/midi'
import MidiStreamSettings from '../components/MidiStreamSettings.js'

const mapStateToProps = (state, ownProps) => {
  return {
    currentChannel: state.midi.midiSinkChannel,
    deviceMap: state.__volatile.midi.midiSinks,
    valid: state.__volatile.midi.validMidiSink,
    currentDevice: state.midi.midiSinkDevice,
    ccset: state.midi.midiSinkCCs,
    ccadder: addMidiSinkCC,
    ccswapper: swapMidiSinkCC,
    ccremover: removeMidiSinkCC,
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChannelChange: (ev) => dispatch(setMidiSinkChannel(ev)),
    onDeviceChange: (key) => dispatch(setMidiSinkDevice(key)),
  }
};

const MidiSinkSection = connect(
  mapStateToProps,
  mapDispatchToProps
)( MidiStreamSettings );

export default MidiSinkSection;
