import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import VideoSourceSelect from '../containers/VideoSourceSelect'

const VideoSettings = () => (
  <SubPane title="Video" name="video">
    <VideoSourceSelect disabled={false} title="Video In" name="videosource" />
  </SubPane>
)

export default VideoSettings;
