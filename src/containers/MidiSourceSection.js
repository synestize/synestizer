'use strict';
import { connect } from 'react-redux';
import { setValidMidiSourceDevice, setCurrentMidiSourceDevice, setAllMidiSourceDevices, setMidiSourceChannel, swapMidiSourceCC, setMidiSourceCCs, removeMidiSourceCC, addMidiSourceCC, removeMidiSourceCC } from '../actions/midi'
import MidiStreamSettings from '../components/MidiStreamSettings.js'

const mapStateToProps = (state, ownProps) => {
  return {
    currentChannel: state.midi.midiSourceChannel,
    deviceMap: state.__volatile.midi.midiSources,
    valid: state.__volatile.midi.validMidiSource,
    currentDevice: state.midi.currentMidiSource
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChannelChange: (ev) => { setMidiSourceChannel(ev)},
    onDeviceChange: (key) => dispatch(setCurrentMidiSourceDevice(key))
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (key) => dispatch(setCurrentMidiSourceDevice(key))
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
};

const MidiSourceSection = connect(
  mapStateToProps,
  mapDispatchToProps
)( MidiStreamSettings );

export default MidiSourceSection;
