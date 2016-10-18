import React, { Component, PropTypes, Children } from 'react';
import SpecificAudioParam from '../containers/SpecificAudioParam'
import MuteButton from '../components/MuteButton'

const BubbleChamberControl = ({
    onChangeVoice1Mute,
    onChangeVoice2Mute,
    onChangeVoice3Mute,
    onChangeVoice4Mute,
    voice1mute,
    voice2mute,
    voice3mute,
    voice4mute,
  }) => {
  return (<div className="subpane">
    <h2 className='vert'>Bubble Chamber</h2>
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch__0001' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch__0002' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch__0003' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch__0004' />
    <div className='voice1'>
      <h3>Voice 1</h3>
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1bottom' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1rate' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1density' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1scramble' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1delayTime' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1smear' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1gain' />
      <MuteButton mute={voice1mute} onClick={onChangeVoice1Mute} />
    </div>
    <div className='voice1'>
      <h3>Voice 2</h3>
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2bottom' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2rate' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2density' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2scramble' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2delayTime' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2smear' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2gain' />
      <MuteButton mute={voice2mute} onClick={onChangeVoice2Mute} />
    </div>
  </div>)
}

BubbleChamberControl.propTypes = {
  onChangeVoice1Mute: PropTypes.func.isRequired,
  onChangeVoice2Mute: PropTypes.func.isRequired,
  onChangeVoice3Mute: PropTypes.func.isRequired,
  onChangeVoice4Mute: PropTypes.func.isRequired,
  voice1mute: PropTypes.bool,
  voice2mute: PropTypes.bool,
  voice3mute: PropTypes.bool,
  voice4mute: PropTypes.bool,
}

export default BubbleChamberControl
