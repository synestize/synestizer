//Main entry point for whole app
//Main entry point for whole app
"use strict";

import React, { PropTypes } from 'react'
import { combineReducers } from 'redux';
import Rx from 'rx'
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import * as reducers from './reducers'
import App from './views/app';

//debug mode:
Rx.config.longStackSupport = true;

const synestizerApp = combineReducers(reducers)
const store = createStore(synestizerApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
