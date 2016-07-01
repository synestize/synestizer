'use strict';
import { connect } from 'react-redux';
import { setValidMidiSource, setCurrentMidiSource, setAllMidiSources } from '../actions/midi'
import DeviceSelect from '../components/DeviceSelect.js'

const mapStateToProps = (state, ownProps) => {
  return {
    deviceMap: state.midi.__midiSources,
    valid: state.midi.__validMidiSource,
    currentDevice: state.midi.currentMidiSource
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (key) => setCurrentMidiSource(key)
  }
};

const MidiSourceSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)( DeviceSelect );

export default MidiSourceSelect;
