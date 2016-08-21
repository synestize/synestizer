import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import AudioSourceSelect from '../containers/AudioSourceSelect'
import AudioSinkSelect from '../containers/AudioSinkSelect'
import AudioSignalMax from '../containers/AudioSignalMax'

const AudioSettings = () => (
  <SubPane title="Audio" name="video">
    <AudioSourceSelect disabled={false} title="Audio In" name="audiosource" />
    <AudioSinkSelect disabled={false} title="Audio Out" name="audiosink" />
    <AudioSignalMax title="Audio Signal select" />
  </SubPane>
)

export default AudioSettings;
