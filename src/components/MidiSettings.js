import React from 'react'
import SubPane from './SubPane'
import MidiSourceSection from '../features/midi/components/MidiSourceSection'
import MidiSinkSection from '../features/midi/components/MidiSinkSection'

const MidiSettings = () => (
  <SubPane title="" className="midi squeeze">
    <MidiSourceSection />
    <MidiSinkSection />
  </SubPane>
)

export default MidiSettings;
