import Pane from './Pane';
import React, { Component, PropTypes, Children } from 'react';
import PatchMatrix from './PatchMatrix'

const PatchingPane = () => (<Pane paneId="patching-pane" >
  <PatchMatrix />
</Pane>)

export default PatchingPane;
