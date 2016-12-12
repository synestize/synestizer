import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import RandomizeButton from '../containers/RandomizeButton'
import ResetButton from '../containers/ResetButton'
import NukeButton from '../containers/NukeButton'
import AppStateWidget from '../containers/AppStateWidget'

const AppSettings = () => (
  <SubPane title="Master Settings" className="app squeeze">
    <RandomizeButton />
    <ResetButton />
    <NukeButton />
    <AppStateWidget />
  </SubPane>
)

export default AppSettings;
