import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import RandomizeButton from '../containers/RandomizeButton'
import NukeButton from '../containers/NukeButton'

const AppSettings = () => (
  <SubPane title="Synestizer" className="app squeeze">
    <RandomizeButton />
    <NukeButton />
  </SubPane>
)

export default AppSettings;
