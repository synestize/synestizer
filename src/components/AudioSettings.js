import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import AudioSourceSelect from '../containers/AudioSourceSelect'

const AudioSettings = () => (
  <SubPane title="Audio" name="video">
    <AudioSourceSelect disabled={false} title="Audio In" name="audiosource" />
  </SubPane>
)

export default AudioSettings;
