'use strict';
import { connect } from 'react-redux';
import { setValidMidiSource, setCurrentMidiSource, setAllMidiSources } from '../actions/midi'
import DeviceSelect from '../components/DeviceSelect.js'

const mapStateToProps = (state, ownProps) => {
  return {
    deviceMap: state.__volatile.midi.midiSources,
    valid: state.__volatile.midi.validMidiSource,
    currentDevice: state.midi.currentMidiSource
  }
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onChange: (key) => dispatch(setCurrentMidiSource(key))
  }
};

const MidiSourceSelect = connect(
  mapStateToProps,
  mapDispatchToProps
)( DeviceSelect );

export default MidiSourceSelect;
