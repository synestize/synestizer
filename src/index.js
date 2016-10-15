// Main entry point everything
import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import App from './components/App'

const appRoot = render(
  <App />,
  document.getElementById('synapp')
);
