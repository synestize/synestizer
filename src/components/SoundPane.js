import Pane from './Pane';
import VideoSettings from './VideoSettings';
import MidiSettings from './MidiSettings';
import React, { Component, PropTypes, Children } from 'react';

const SoundPane = ({version}) => (<Pane paneId="audio-pane" version={version}>
<p>Coming soon</p>
</Pane>)

export default SoundPane;
