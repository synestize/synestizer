import Pane from './Pane';
import ActiveBubbleChamberControl from '../features/audio/components/ActiveBubbleChamberControl';
import AudioMasterControls from '../components/AudioMasterControls';
import React from 'react';

const SoundPane = ({}) => (
  <Pane paneId="audio-pane" >
    <AudioMasterControls />
    <ActiveBubbleChamberControl />
  </Pane>)

export default SoundPane;
