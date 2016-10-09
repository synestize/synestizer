import Pane from './Pane';
import ActiveBubbleChamberControl from '../containers/ActiveBubbleChamberControl';
import AudioMasterControls from '../components/AudioMasterControls';
import React, { Component, PropTypes, Children } from 'react';

const SoundPane = ({version}) => (
  <Pane paneId="audio-pane" version={version}>
    <AudioMasterControls />
    <ActiveBubbleChamberControl />
  </Pane>)

export default SoundPane;
