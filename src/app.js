//Main entry point for whole app
"use strict";

import React, { PropTypes } from 'react'
import { combineReducers } from 'redux';
import Rx from 'rx'
import * as reducers from './reducers'
import { SET_TAB } from './actions'

const synestizerApp = combineReducers(reducers)

export default synestizerApp
