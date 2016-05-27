"use strict";
import { SET_VISIBLE_PANE } from '../actions'

export default function visiblePane(state = "info", action) {
  switch (action.type) {
    case SET_VISIBLE_PANE:
      return action.payload
    default:
      return state
  }
}
