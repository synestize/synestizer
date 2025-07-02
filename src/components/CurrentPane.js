import React from 'react'
import IOPane from './IOPane'
import WelcomePane from './WelcomePane'
import PerformancePane from './PerformancePane'
import SoundPane from './SoundPane'

const CurrentPane = ({visiblePane}) => {
  switch (visiblePane) {
    case 'io':
      return <IOPane />
    case 'welcome':
      return <WelcomePane />
    case 'performance':
     return <PerformancePane />
    case 'sound':
    default:
      return <SoundPane />
  }
}


export default CurrentPane;
