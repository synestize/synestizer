import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import ResetButton from '../containers/ResetButton'
import NukeButton from '../containers/NukeButton'

const AppSettings = () => (
  <SubPane title="Synestizer" name="app">
    <ResetButton />
    <NukeButton />
  </SubPane>
)

export default AppSettings;
