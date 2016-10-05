import React, { Component, PropTypes, Children } from 'react';
import SpecificAudioParam from '../containers/SpecificAudioParam'
import MuteButton from '../components/MuteButton'

const BubbleChamberControl = ({
    onChangeMute,
    mute
  }) => {
  return (<div className="audiocontrolset">
    <h3>Bubble Chamber</h3>
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch-0001' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch-0002' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch-0003' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|bottom' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|gate' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|arprate' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|retriggerinterval' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|gain' />
    <MuteButton mute={mute} onClick={onChangeMute} />
  </div>)
}

BubbleChamberControl.propTypes = {
  onChangeMute: PropTypes.func.isRequired,
  mute: PropTypes.bool
}

export default BubbleChamberControl
