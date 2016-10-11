'use strict';
import { combineReducers } from 'redux'

import { SET_VISIBLE_PANE } from '../actions/gui'

export function visiblePane(state = "sound", action) {
  switch (action.type) {
    case SET_VISIBLE_PANE:
      return action.payload
    default:
      return state
  }
}
const gui = combineReducers({
   visiblePane,
})

export default gui
