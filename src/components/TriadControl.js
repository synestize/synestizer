import React, { Component, PropTypes, Children } from 'react';
import SpecificAudioParam from '../containers/SpecificAudioParam'
import MuteButton from '../components/MuteButton'

const TriadControl = ({
    onChangeMute,
    mute
  }) => {
  return (<div className="audioControlset">
    <SpecificAudioParam sinkControlKey='triad|pitch-0001' />
    <SpecificAudioParam sinkControlKey='triad|pitch-0002' />
    <SpecificAudioParam sinkControlKey='triad|pitch-0003' />
    <SpecificAudioParam sinkControlKey='triad|bottom' />
    <SpecificAudioParam sinkControlKey='triad|gate' />
    <SpecificAudioParam sinkControlKey='triad|arprate' />
    <SpecificAudioParam sinkControlKey='triad|retriggerinterval' />
    <SpecificAudioParam sinkControlKey='triad|gain' />
    <MuteButton mute={mute} onClick={onChangeMute} />
  </div>)
}

TriadControl.propTypes = {
  onChangeMute: PropTypes.func.isRequired,
  mute: PropTypes.bool
}

export default TriadControl
