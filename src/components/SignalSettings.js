import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import GenericSignalMax from '../containers/GenericSignalMax'

const SignalSettings = () => (
  <SubPane title="Signal" name="signal">
    Number of buses: <GenericSignalMax />
  </SubPane>
)

export default SignalSettings;
