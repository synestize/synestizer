//Main entry point for whole app
"use strict";

import React, { PropTypes } from 'react'
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import Rx from 'rx'
import * as reducers from './reducers'
import { SET_TAB } from './actions'

const synestizerApp = combineReducers(reducers)

export default synestizerApp
