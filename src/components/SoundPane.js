import Pane from './Pane';
import ActiveTriadControl from '../containers/ActiveTriadControl';
import ActiveBubbleChamberControl from '../containers/ActiveBubbleChamberControl';
import AudioMasterControls from '../components/AudioMasterControls';
import React, { Component, PropTypes, Children } from 'react';

const SoundPane = ({version}) => (
  <Pane paneId="audio-pane" version={version}>
    <AudioMasterControls />
    <ActiveTriadControl />
    <ActiveBubbleChamberControl />
  </Pane>)

export default SoundPane;
