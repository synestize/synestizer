import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import AudioSourceDeviceSelect from '../containers/AudioSourceDeviceSelect'
import AudioSinkDeviceSelect from '../containers/AudioSinkDeviceSelect'

const AudioSettings = () => (
  <SubPane title="Audio" name="video">
    <AudioSourceDeviceSelect disabled={false} title="Audio In" name="audiosource" />
    <AudioSinkDeviceSelect disabled={false} title="Audio Out" name="audiosink" />
  </SubPane>
)

export default AudioSettings;
