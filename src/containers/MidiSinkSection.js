'use strict';
import { connect } from 'react-redux';
import { setValidMidiSinkDevice, setMidiSinkDevice, setAllMidiSinkDevices, setMidiSinkChannel, removeMidiSinkCC, addMidiSinkCC, soloMidiSinkCC, addUnknownMidiSinkCC } from '../actions/midi'
import MidiStreamSettings from '../components/MidiStreamSettings.js'

const mapStateToProps = (state, ownProps) => {
  return {
    currentChannel: state.midi.sourceChannel,
    deviceMap: state.__volatile.midi.sinks,
    valid: state.__volatile.midi.validMidiSink,
    currentDevice: state.midi.sinkDevice,
    ccset: state.midi.sinkCCs,
    ccadder: addMidiSinkCC,
    ccremover: removeMidiSinkCC,
    ccunknownadder: addUnknownMidiSinkCC,
    ccsolotoggler: soloMidiSinkCC,
    solocc: state.midi.sinkSoloCC,
    title: 'Midi Out',
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
