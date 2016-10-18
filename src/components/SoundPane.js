import Pane from './Pane';
import ActiveBubbleChamberControl from '../containers/ActiveBubbleChamberControl';
import AudioMasterControls from '../components/AudioMasterControls';
import React, { Component, PropTypes, Children } from 'react';

const SoundPane = ({}) => (
  <Pane paneId="audio-pane" >
    <ActiveBubbleChamberControl />
    <AudioMasterControls />
  </Pane>)

export default SoundPane;
