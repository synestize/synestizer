import React from 'react'
import SubPane from './SubPane'
import AudioSourceDeviceSelect from '../features/audio/components/AudioSourceDeviceSelect'
import AudioSinkDeviceSelect from '../features/audio/components/AudioSinkDeviceSelect'

const AudioSettings = () => (
  <SubPane title="Audio" className="audio squeeze">
    <AudioSourceDeviceSelect disabled={false} title="Audio In" name="audiosource" />
    <AudioSinkDeviceSelect disabled={false} title="Audio Out" name="audiosink" />
  </SubPane>
)

export default AudioSettings;
