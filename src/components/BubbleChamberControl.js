import React, { Component, PropTypes, Children } from 'react';
import SpecificAudioParam from '../containers/SpecificAudioParam'
import MuteButton from '../components/MuteButton'
import SubPane from '../components/SubPane'
import BufferSelect from '../containers/BufferSelect'

const BubbleChamberControl = ({
    onChangeVoice1Mute,
    onChangeVoice2Mute,
    onChangeVoice3Mute,
    onChangeBassMute,
    voice1mute,
    voice2mute,
    voice3mute,
    bassmute,
    onChangeVoice1Sample,
    onChangeVoice2Sample,
    onChangeVoice3Sample,
    voice1sample,
    voice2sample,
    voice3sample,
  }) => {
  return (<SubPane className='vert' title='Bubble Chamber'>
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch__0001' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch__0002' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch__0003' />
    <SpecificAudioParam sinkControlKey='bubbleChamber|pitch__0004' />
    <SubPane className='vert' title='Voice 1'>
      <MuteButton mute={voice1mute} onClick={onChangeVoice1Mute} />
      <BufferSelect currentOpt={voice1sample} onChange={onChangeVoice1Sample} />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1bottom' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1rate' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1density' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1pan' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1scramble' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1delayScale' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1smear' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice1gain' />
    </SubPane>
    <SubPane className='vert' title='Voice 2'>
      <MuteButton mute={voice2mute} onClick={onChangeVoice2Mute} />
      <BufferSelect currentOpt={voice2sample} onChange={onChangeVoice2Sample} />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2bottom' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2rate' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2density' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2scramble' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2delayScale' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2smear' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|voice2gain' />
    </SubPane>
    <SubPane className='vert' title='Bass'>
      <MuteButton mute={bassmute} onClick={onChangeBassMute} />
      <SpecificAudioParam sinkControlKey='bubbleChamber|bassbottom' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|basspitch' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|bassspread' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|basscutoff' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|bassdistort' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|bassovertones' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|bassslide' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|bassattack' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|bassdecay' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|bassdensity' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|bassrate' />
      <SpecificAudioParam sinkControlKey='bubbleChamber|bassgain' />
    </SubPane>
  </SubPane>)
}

BubbleChamberControl.propTypes = {
  onChangeVoice1Mute: PropTypes.func.isRequired,
  onChangeVoice2Mute: PropTypes.func.isRequired,
  onChangeVoice3Mute: PropTypes.func.isRequired,
  onChangeBassMute: PropTypes.func.isRequired,
  voice1mute: PropTypes.bool,
  voice2mute: PropTypes.bool,
  voice3mute: PropTypes.bool,
  bassmute: PropTypes.bool,
}

export default BubbleChamberControl
