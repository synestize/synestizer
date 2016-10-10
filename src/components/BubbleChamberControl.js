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
    <SpecificAudioParam sinkControlKey='bubbleChamber|bottom1' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|rate1' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|density1' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|shuffle1' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|delay' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|smear1' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|gain1' />
    <MuteButton mute={mute} onClick={onChangeMute} />
  </div>)
}

BubbleChamberControl.propTypes = {
  onChangeMute: PropTypes.func.isRequired,
  mute: PropTypes.bool
}

export default BubbleChamberControl
