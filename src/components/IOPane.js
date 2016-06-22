import Pane from './Pane';
import VideoSettings from './VideoSettings';
import React, { Component, PropTypes, Children } from 'react';

const IOPane = () => (<Pane paneId="io-pane" >
  <VideoSettings />
  </Pane>)

export default IOPane;
