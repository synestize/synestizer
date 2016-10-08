import React, { Component, PropTypes, Children } from 'react';
import SpecificAudioParam from '../containers/SpecificAudioParam'
import MuteButton from '../components/MuteButton'

const TriadControl = ({
    onChangeMute,
    mute
  }) => {
  return (<div className="audiocontrolset">
    <h3>Triad</h3>
    <SpecificAudioParam sinkControlKey='triad|pitch__0001' />
    <SpecificAudioParam sinkControlKey='triad|pitch__0002' />
    <SpecificAudioParam sinkControlKey='triad|pitch__0003' />
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
