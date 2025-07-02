import React from 'react'
import SubPane from './SubPane'
import VideoSourceSelect from '../features/video/components/VideoSourceSelect'

const VideoSettings = () => (
  <SubPane title="Video" name="video" className='squeeze'>
    <VideoSourceSelect disabled={false} title="Video In" name="videosource" />
  </SubPane>
)

export default VideoSettings;
