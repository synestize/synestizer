import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setMidiSinkDevice,
  setMidiSinkChannel,
  removeMidiSinkCC,
  addMidiSinkCC,
  toggleSoloMidiSinkCC,
  addUnknownMidiSinkCC
} from '../midiSlice';
import DeviceSelect from '../../../components/DeviceSelect';
import IntSelect from '../../../components/IntSelect';
import MidiCCSet from '../../../components/MidiCCSet';

const MidiSinkSection = () => {
  const dispatch = useDispatch();
  
  const currentChannel = useSelector(state => state.midi.sinkChannel);
  const deviceMap = useSelector(state => state.__volatile.midi.sinks);
  const valid = useSelector(state => state.__volatile.midi.validMidiSink);
  const currentDevice = useSelector(state => state.midi.sinkDevice);
  const ccset = useSelector(state => state.midi.sinkCCs);
  const solocc = useSelector(state => state.midi.sinkSoloCC);

  const handleChannelChange = (ev) => {
    dispatch(setMidiSinkChannel(ev));
  };

  const handleDeviceChange = (key) => {
    dispatch(setMidiSinkDevice(key));
  };

  return (
    <section>
      <h3>Midi Out</h3>
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
        adder={addMidiSinkCC}
        remover={removeMidiSinkCC}
        solotoggler={toggleSoloMidiSinkCC}
        solocc={solocc}
        unknownadder={addUnknownMidiSinkCC}
      />
    </section>
  );
};

export default MidiSinkSection;