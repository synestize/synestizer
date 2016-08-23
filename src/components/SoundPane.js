import Pane from './Pane';
import ControlTriad from '../containers/ControlTriad';
import React, { Component, PropTypes, Children } from 'react';

const SoundPane = ({version}) => (<Pane paneId="audio-pane" version={version}>
<ControlTriad />
</Pane>)

export default SoundPane;
