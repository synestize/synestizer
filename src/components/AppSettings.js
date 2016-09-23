import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import ResetButton from '../containers/ResetButton'

const AppSettings = () => (
  <SubPane title="Synestizer" name="app">
    <ResetButton />
  </SubPane>
)

export default AppSettings;
