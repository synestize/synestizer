import Pane from './Pane';
import React, { Component, PropTypes, Children } from 'react';
import ActivePatchMatrix from '../containers/ActivePatchMatrix'

const PatchingPane = () => (<Pane paneId="patching-pane" >
  <ActivePatchMatrix />
</Pane>)

export default PatchingPane;
