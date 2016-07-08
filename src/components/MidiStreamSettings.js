import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import DeviceSelect from '../components/DeviceSelect'
import IntSelect from '../components/IntSelect'
import MidiCCSet from '../components/MidiCCSet'

const MidiStreamSettings = ( {
  currentChannel,
  deviceMap,
  valid,
  currentDevice,
  ccadder,
  ccswapper,
  ccremover,
  ccset,
  onChannelChange,
  onDeviceChange,
}) => {
  return (<div>
  <DeviceSelect
    onChange={onDeviceChange}
    currentDevice={currentDevice}
    deviceMap={deviceMap} name="" />
  <IntSelect currentNum={currentChannel} onChange={onChannelChange} maxNum={16} />
  <MidiCCSet ccset={ccset} adder={ccadder} remover={ccremover} swapper={ccswapper} />
</div>)}

export default MidiStreamSettings;
