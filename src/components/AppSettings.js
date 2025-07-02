import React from 'react'
import SubPane from './SubPane'
import RandomizeButton from '../features/gui/components/RandomizeButton'
import ResetButton from '../features/gui/components/ResetButton'
import NukeButton from '../features/gui/components/NukeButton'
import AppStateWidget from '../features/gui/components/AppStateWidget'

const AppSettings = () => (
  <SubPane title="Master Settings" className="app squeeze">
    <RandomizeButton />
    <ResetButton />
    <NukeButton />
    <AppStateWidget />
  </SubPane>
)

export default AppSettings;
