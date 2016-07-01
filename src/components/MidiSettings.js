import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import MidiSourceSelect from '../containers/MidiSourceSelect'
import MidiSourceChannelSelect from '../containers/MidiSourceChannelSelect'
import MidiSourceCCSelect from '../containers/MidiSourceCCSelect'

/*
const allNumbers = [];
for (let i=0; i<127; i++) {
  allNumbers.push(i)
}
*/

const MidiSettings = () => (
  <SubPane title="Midi" name="midi">
    <MidiSourceSelect disabled={false} title="Midi In" name="midisource" />
    <MidiSourceChannelSelect />
    { /*<MidiSinkSelect disabled={false} title="Midi Out" name="midisink" /> */ }
  </SubPane>
)

export default MidiSettings;
