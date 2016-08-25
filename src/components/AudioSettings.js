import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import AudioSourceDeviceSelect from '../containers/AudioSourceDeviceSelect'
import AudioSinkDeviceSelect from '../containers/AudioSinkDeviceSelect'
import AudioSignalMax from '../containers/AudioSignalMax'

const AudioSettings = () => (
  <SubPane title="Audio" name="video">
    <AudioSourceDeviceSelect disabled={false} title="Audio In" name="audiosource" />
    <AudioSinkDeviceSelect disabled={false} title="Audio Out" name="audiosink" />
    Number of buses: <AudioSignalMax />
  </SubPane>
)

export default AudioSettings;
