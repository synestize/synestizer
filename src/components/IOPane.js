import Pane from './Pane';
import VideoSettings from './VideoSettings';
import MidiSettings from './MidiSettings';
import AudioSettings from './AudioSettings';
import SignalSettings from './SignalSettings';
import AppSettings from './AppSettings';
import React, { Component, PropTypes, Children } from 'react';

const IOPane = ({version}) => {return (
  <Pane paneId="io-pane" version={version}>
    <VideoSettings />
    <AudioSettings />
    <MidiSettings />
    <SignalSettings />
    <AppSettings />
  </Pane>
)}


IOPane.propTypes = {
  version: PropTypes.string.isRequired,
}

export default IOPane;
