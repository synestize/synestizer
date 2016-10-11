import React, { Component, PropTypes } from 'react'
import IOPane from './IOPane'
import WelcomePane from './WelcomePane'
import PerformancePane from './PerformancePane'
import SoundPane from './SoundPane'

const CurrentPane = ({visiblePane, version}) => {
  switch (visiblePane) {
    case 'io':
      return <IOPane version={version}/>
    case 'welcome':
      return <WelcomePane version={version} />
    case 'performance':
      return <PerformancePane version={version} />
    case 'sound':
    default:
      return <SoundPane version={version} />
  }
}

CurrentPane.propTypes = {
  visiblePane: PropTypes.oneOf([
    'io', 'welcome', 'performance', 'sound'
  ]),
  version: PropTypes.string.isRequired
}

export default CurrentPane;
