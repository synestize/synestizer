import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import VideoInDeviceSelect from '../containers/VideoInDeviceSelect'

const VideoSettings = () => (
  <SubPane title="Video" name="video">
    <VideoInDeviceSelect disabled={false} title="Video In" name="videoindevice" />
  </SubPane>
)

export default VideoSettings;
