import React from 'react'
import SubPane from './SubPane'
import DeviceSelect from '../components/DeviceSelect'
import IntSelect from '../components/IntSelect'
import MidiCCSet from '../components/MidiCCSet'

const MidiStreamSettings = ( {
  title,
  currentChannel,
  deviceMap,
  valid,
  currentDevice,
  ccadder,
  ccunknownadder,
  ccremover,
  ccset,
  ccsolotoggler,
  solocc,
  onChannelChange,
  onDeviceChange,
}) => {
  return (<section>
    <h3>{title}</h3>
  <DeviceSelect
    onChange={onDeviceChange}
    currentDevice={currentDevice}
    deviceMap={deviceMap} name=""
    withNull={true}
  />
  <IntSelect
    currentNum={currentChannel}
    onChange={onChannelChange}
    maxNum={16} />
  <MidiCCSet ccset={ccset}
    adder={ccadder}
    remover={ccremover}
    solotoggler={ccsolotoggler}
    solocc={solocc}
    unknownadder={ccunknownadder} />
</section>)}


export default MidiStreamSettings;
