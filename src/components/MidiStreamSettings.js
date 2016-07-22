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
  ccremover,
  ccset,
  ccsolotoggler,
  solocc,
  onChannelChange,
  onDeviceChange,
}) => {
  return (<div>
  <DeviceSelect
    onChange={onDeviceChange}
    currentDevice={currentDevice}
    deviceMap={deviceMap} name="" />
  <IntSelect currentNum={currentChannel} onChange={onChannelChange} maxNum={16} />
  <MidiCCSet ccset={ccset} adder={ccadder} remover={ccremover} solotoggler={ccsolotoggler} solocc={solocc}/>
</div>)}

MidiStreamSettings.propTypes = {
  ccset: PropTypes.array.isRequired,
  solocc: PropTypes.number,
  currentChannel: PropTypes.number.isRequired,
  deviceMap: PropTypes.instanceOf(Map).isRequired,
  valid: PropTypes.bool,
  currentDevice: PropTypes.string,
  ccadder: PropTypes.func.isRequired,
  ccremover: PropTypes.func.isRequired,
  ccsolotoggler: PropTypes.func,
  onChannelChange: PropTypes.func.isRequired,
  onDeviceChange: PropTypes.func.isRequired,
}

export default MidiStreamSettings;
