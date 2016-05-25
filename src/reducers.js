"use strict";

import { combineReducers } from 'redux'
import { SET_TAB } from './actions'

export function setTab(state = "info", action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter
    default:
      return state
  }
}
