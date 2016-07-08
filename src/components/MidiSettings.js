import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import MidiSourceSection from '../containers/MidiSourceSection'

const MidiSettings = () => (
  <SubPane title="Midi" name="midi">
  <MidiSourceSection />
  </SubPane>
)

export default MidiSettings;
