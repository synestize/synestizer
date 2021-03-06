import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import MidiSourceSection from '../containers/MidiSourceSection'
import MidiSinkSection from '../containers/MidiSinkSection'

const MidiSettings = () => (
  <SubPane title="" className="midi squeeze">
    <MidiSourceSection />
    <MidiSinkSection />
  </SubPane>
)

export default MidiSettings;
