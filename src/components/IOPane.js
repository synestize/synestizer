import Pane from './Pane';
import VideoSettings from './VideoSettings';
import MidiSettings from './MidiSettings';
// import AudioSettings from './AudioSettings';
import React, { Component, PropTypes, Children } from 'react';
/* <AudioSettings /> */

const IOPane = () => {return (
  <Pane paneId="io-pane" >
    <VideoSettings />
    <MidiSettings />
  </Pane>
)}

export default IOPane;
