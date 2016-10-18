import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import ResetButton from '../containers/ResetButton'
import NukeButton from '../containers/NukeButton'

const AppSettings = () => (
  <SubPane title="Synestizer" className="app squeeze">
    <ResetButton />
    <NukeButton />
  </SubPane>
)

export default AppSettings;
