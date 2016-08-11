import React, { Component, PropTypes } from 'react'
import IOPane from './IOPane'
import WelcomePane from './WelcomePane'
import PatchingPane from './PatchingPane'
import PerformancePane from './PerformancePane'
import AudioPane from './AudioPane'

const renderer = {
  io: () => <IOPane />,
  welcome: () => <WelcomePane />,
  patching: () => <PatchingPane />,
  audio: () => <AudioPane />,
  performance: () => <PerformancePane />
}

const CurrentPane = ({visiblePane}) => {
  return renderer[visiblePane]()
}

CurrentPane.propTypes = {
  visiblePane: PropTypes.oneOf([
    'io', 'welcome', 'patching', 'performance', 'audio'
  ]),
}

export default CurrentPane;
