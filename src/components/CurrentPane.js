import React, { Component, PropTypes } from 'react'
import IOPane from './IOPane'
import WelcomePane from './WelcomePane'
import PatchingPane from './PatchingPane'
import PerformancePane from './PerformancePane'
import SoundPane from './SoundPane'

const renderer = {
  io: () => <IOPane />,
  welcome: () => <WelcomePane />,
  patching: () => <PatchingPane />,
  sound: () => <SoundPane />,
  performance: () => <PerformancePane />
}

const CurrentPane = ({visiblePane}) => {
  return renderer[visiblePane]()
}

CurrentPane.propTypes = {
  visiblePane: PropTypes.oneOf([
    'io', 'welcome', 'patching', 'performance', 'sound'
  ]),
}

export default CurrentPane;
