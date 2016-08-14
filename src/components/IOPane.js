import Pane from './Pane';
import VideoSettings from './VideoSettings';
import MidiSettings from './MidiSettings';
import AudioSettings from './AudioSettings';
import React, { Component, PropTypes, Children } from 'react';

const IOPane = () => {return (
  <Pane paneId="io-pane" >
    <VideoSettings />
    <AudioSettings />
    <MidiSettings />
  </Pane>
)}

export default IOPane;
