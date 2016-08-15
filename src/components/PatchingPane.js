import Pane from './Pane';
import React, { Component, PropTypes, Children } from 'react';
import ActivePatchMatrix from '../containers/ActivePatchMatrix'

const PatchingPane = ({version}) => (<Pane paneId="patching-pane" version={version}>
  <ActivePatchMatrix />
</Pane>)

export default PatchingPane;
