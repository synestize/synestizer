//Main entry point for whole app
"use strict";

import React, { PropTypes } from 'react'
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import Rx from 'rx'
import * as reducers from './reducers'
import { SET_TAB } from './actions'

//debug mode:
Rx.config.longStackSupport = true;

const store = createStore(synestizerApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
