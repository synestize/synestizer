import Pane from './Pane';
import VideoSettings from './VideoSettings';
import MidiSettings from './MidiSettings';
import AudioSettings from './AudioSettings';
import SignalSettings from './SignalSettings';
import AppSettings from './AppSettings';
import ActivePatchMatrix from '../containers/ActivePatchMatrix'

import React, { Component, PropTypes, Children } from 'react';

const IOPane = ({}) => {
  let permittedSettingPanes = [];
  if (!GALLERY) {
    permittedSettingPanes.push(
      <AppSettings key='AppSettings'/>
    )
  }
  permittedSettingPanes.push(<ActivePatchMatrix key='ActivePatchMatrix'/>)
  if (!GALLERY) {
    permittedSettingPanes.push(...[
      <VideoSettings key='VideoSettings' />,
      // <AudioSettings key='AudioSettings'/>,
      <MidiSettings key='MidiSettings'/>,
      <SignalSettings key='SignalSettings'/>,
    ])
  }
  return (
  <Pane paneId="io-pane">
    {permittedSettingPanes}
  </Pane>
  )
}


IOPane.propTypes = {}

export default IOPane;
