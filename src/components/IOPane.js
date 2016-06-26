import Pane from './Pane';
import VideoSettings from './VideoSettings';
import MidiSettings from './MidiSettings';
import React, { Component, PropTypes, Children } from 'react';

const IOPane = () => (<Pane paneId="io-pane" >
  <VideoSettings />
  <MidiSettings />
</Pane>)

export default IOPane;
