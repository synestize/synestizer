import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import MidiSourceSelect from '../containers/MidiSourceSelect'
import IntSelect from './IntSelect'

const MidiSettings = () => (
  <SubPane title="Midi" name="midi">
    <MidiSourceSelect disabled={false} title="Midi In" name="midisource" />
    <IntSelect disabled={false} title="Channel" name="midisource" />
    { /*<MidiSinkSelect disabled={false} title="Midi Out" name="midisink" /> */ }
  </SubPane>
)

export default MidiSettings;
