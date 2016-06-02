//Main entry point for whole app
//Main entry point for whole app
"use strict";

import Rx from 'rx'
import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'

import * as reducers from './reducers'
import CurrentApp from './containers/CurrentApp'

console.debug(reducers);
//debug mode:
Rx.config.longStackSupport = true;

const synestizerApp = combineReducers(reducers)
const store = createStore(synestizerApp)

render(
  <Provider store={store}>
    <CurrentApp />
  </Provider>,
  document.getElementById('app')
)
