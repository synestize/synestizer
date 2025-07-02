import React from 'react'
import SubPane from './SubPane'
import GenericSignalMax from '../features/signal/components/GenericSignalMax'

const SignalSettings = () => (
  <SubPane title="Signal" className="signal squeeze">
    Number of buses: <GenericSignalMax />
  </SubPane>
)

export default SignalSettings;
