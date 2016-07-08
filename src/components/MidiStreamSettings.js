import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import MidiDeviceSelect from '../containers/MidiDeviceSelect'
import MidiChannelSelect from '../containers/MidiChannelSelect'
import MidiSourceCCSelect from '../containers/MidiSourceCCSelect'

const MidiStreamSettings = () => (<div>
  <MidiDeviceSelect />
  <MidiChannelSelect />
  <MidiCCSet />
</div>)

export default MidiStreamSettings;
