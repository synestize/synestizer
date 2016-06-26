import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import MidiSourceSelect from '../containers/MidiSourceSelect'

const MidiSettings = () => (
  <SubPane title="Midi" name="midi">
    <MidiSourceSelect disabled={false} title="Midi In" name="midisource" />
    { /*<MidiSinkSelect disabled={false} title="Midi Out" name="midisink" /> */ }
  </SubPane>
)

export default MidiSettings;
