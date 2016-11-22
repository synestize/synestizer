import React, { Component, PropTypes } from 'react'
import SubPane from './SubPane'
import RandomizeButton from '../containers/RandomizeButton'
import NukeButton from '../containers/NukeButton'
import SaveWidget from '../containers/SaveWidget'
import LoadWidget from '../containers/LoadWidget'

const AppSettings = () => (
  <SubPane title="Synestizer" className="app squeeze">
    <RandomizeButton />
    <NukeButton />
    <LoadWidget />
    <SaveWidget />
  </SubPane>
)

export default AppSettings;
