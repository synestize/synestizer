import Pane from './Pane';
import VideoSettings from './VideoSettings';
import MidiSettings from './MidiSettings';
import AudioSettings from './AudioSettings';
import SignalSettings from './SignalSettings';
import AppSettings from './AppSettings';
import ActivePatchMatrix from '../containers/ActivePatchMatrix'

import React, { Component, PropTypes, Children } from 'react';

const IOPane = ({}) => {return (
  <Pane paneId="io-pane"  >
    <VideoSettings />
    <AudioSettings />
    <MidiSettings />
    <SignalSettings />
    <ActivePatchMatrix />
    <AppSettings />
  </Pane>
)}


IOPane.propTypes = {}

export default IOPane;
