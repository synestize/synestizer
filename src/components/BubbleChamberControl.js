import React, { Component, PropTypes, Children } from 'react';
import SpecificAudioParam from '../containers/SpecificAudioParam'
import MuteButton from '../components/MuteButton'

const BubbleChamberControl = ({
    onChangeMute,
    mute
  }) => {
  return (<div className="audiocontrolset">
    <h3>Bubble Chamber</h3>
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch__0001' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch__0002' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch__0003' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch__0004' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|voice1bottom' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|voice1rate' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|voice1density' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|voice1scramble' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|voice1delayTime' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|voice1smear' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|voice1gain' />
    <MuteButton mute={mute} onClick={onChangeMute} />
  </div>)
}

BubbleChamberControl.propTypes = {
  onChangeMute: PropTypes.func.isRequired,
  mute: PropTypes.bool
}

export default BubbleChamberControl
