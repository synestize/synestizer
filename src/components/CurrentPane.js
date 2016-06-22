import React, { Component, PropTypes } from 'react'
import IOPane from './IOPane'
import WelcomePane from './WelcomePane'

const renderer = {
  io: () => <IOPane />,
  welcome: () => <WelcomePane />
}

const CurrentPane = ({visiblePane}) => {
  return renderer[visiblePane]()
}

CurrentPane.propTypes = {
  visiblePane: PropTypes.string,
}

export default CurrentPane;
