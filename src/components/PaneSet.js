import React, { Component, PropTypes } from 'react'
import TabNav from './TabNav'
import CurrentPane from './CurrentPane'

const PaneSet = ({visiblePane}) => {
  return (<div >
    <TabNav />
    <CurrentPane visiblePane={visiblePane} />
  </div>)
}

PaneSet.propTypes = {
  visiblePane: PropTypes.string.isRequired,
}

export default PaneSet;
