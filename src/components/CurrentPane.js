import React, { Component, PropTypes } from 'react'
import IOPane from './IOPane'
import WelcomePane from './WelcomePane'
import PatchingPane from './PatchingPane'
import PerformancePane from './PerformancePane'
import SoundPane from './SoundPane'

const CurrentPane = ({visiblePane, version}) => {
  return {
    io: () => <IOPane version={version}/>,
    welcome: () => <WelcomePane version={version} />,
    patching: () => <PatchingPane version={version} />,
    sound: () => <SoundPane version={version} />,
    performance: () => <PerformancePane version={version} />
  }[visiblePane]()
}

CurrentPane.propTypes = {
  visiblePane: PropTypes.oneOf([
    'io', 'welcome', 'patching', 'performance', 'sound'
  ]),
  version: PropTypes.string.isRequired
}

export default CurrentPane;
