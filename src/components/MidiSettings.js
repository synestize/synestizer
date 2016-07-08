import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import MidiDeviceSelect from '../containers/MidiDeviceSelect'
import MidiChannelSelect from '../containers/MidiChannelSelect'
import MidiSourceCCSelect from '../containers/MidiSourceCCSelect'

/*
const allNumbers = [];
for (let i=0; i<127; i++) {
  allNumbers.push(i)
}
*/

const MidiSettings = () => (
  <SubPane title="Midi" name="midi">
  <MidiSourceSection />
  </SubPane>
)

export default MidiSettings;
