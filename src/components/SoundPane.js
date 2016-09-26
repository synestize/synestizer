import Pane from './Pane';
import ActiveTriadControl from '../containers/ActiveTriadControl';
import AudioMasterControls from '../components/AudioMasterControls';
import React, { Component, PropTypes, Children } from 'react';

const SoundPane = ({version}) => (
  <Pane paneId="audio-pane" version={version}>
    <AudioMasterControls />
    <ActiveTriadControl />
  </Pane>)

export default SoundPane;
