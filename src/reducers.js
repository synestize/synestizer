"use strict";

import { SET_VISIBLE_PANE } from './actions'

export function setVisiblePane(state = "info", action) {
  switch (action.type) {
    case SET_VISIBLE_PANE:
      return action.payload
    default:
      return state
  }
}

export function setVisiblePane(state = "info", action) {
  switch (action.type) {
    case SET_VISIBLE_PANE:
      return action.payload
    default:
      return state
  }
}
