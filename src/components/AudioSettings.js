import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import AudioSourceSelect from '../containers/AudioSourceSelect'
import AudioSinkSelect from '../containers/AudioSinkSelect'

const AudioSettings = () => (
  <SubPane title="Audio" name="video">
    <AudioSourceSelect disabled={false} title="Audio In" name="audiosource" />
    <AudioSinkSelect disabled={false} title="Audio Out" name="audiosink" />
  </SubPane>
)

export default AudioSettings;
