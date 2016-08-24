import Pane from './Pane';
import ControlTriad from '../containers/ControlTriad';
import React, { Component, PropTypes, Children } from 'react';

const SoundPane = ({version}) => (
  <Pane paneId="audio-pane" version={version}>
    <p>coming soon</p>
    <ControlTriad />
  </Pane>)

export default SoundPane;
