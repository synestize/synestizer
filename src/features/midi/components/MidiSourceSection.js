import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setMidiSourceDevice,
  setMidiSourceChannel,
  removeMidiSourceCC,
  addMidiSourceCC,
  addUnknownMidiSourceCC
} from '../midiSlice';
import DeviceSelect from '../../../components/DeviceSelect';
import IntSelect from '../../../components/IntSelect';
import MidiCCSet from '../../../components/MidiCCSet';

const MidiSourceSection = () => {
  const dispatch = useDispatch();
  
  const currentChannel = useSelector(state => state.midi.sourceChannel);
  const deviceMap = useSelector(state => state.__volatile.midi.sources);
  const valid = useSelector(state => state.__volatile.midi.validSource);
  const currentDevice = useSelector(state => state.midi.sourceDevice);
  const ccset = useSelector(state => state.midi.sourceCCs);

  const handleChannelChange = (ev) => {
    dispatch(setMidiSourceChannel(ev));
  };

  const handleDeviceChange = (key) => {
    dispatch(setMidiSourceDevice(key));
  };

  return (
    <section>
      <h3>Midi In</h3>
      <DeviceSelect
        onChange={handleDeviceChange}
        currentDevice={currentDevice}
        deviceMap={deviceMap}
        name=""
        withNull={true}
      />
      <IntSelect
        currentNum={currentChannel}
        onChange={handleChannelChange}
        maxNum={16}
      />
      <MidiCCSet
        ccset={ccset}
        adder={addMidiSourceCC}
        remover={removeMidiSourceCC}
        unknownadder={addUnknownMidiSourceCC}
      />
    </section>
  );
};

export default MidiSourceSection;