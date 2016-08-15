"use strict";
import React, { Component, PropTypes } from 'react'
import TabNav from './TabNav'
import CurrentPane from './CurrentPane'

const PaneSet = ({visiblePane, version}) => {
  return (<div >
    <TabNav />
    <CurrentPane visiblePane={visiblePane} version={version} />
  </div>)
}

PaneSet.propTypes = {
  visiblePane: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
}

export default PaneSet;
