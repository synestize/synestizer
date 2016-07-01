import { SET_VISIBLE_PANE } from '../actions/app'
//import { SET_DOCUMENT, SAVE_DOCUMENT } from '../actions/app'

export function visiblePane(state = "welcome", action) {
  switch (action.type) {
    case SET_VISIBLE_PANE:
      return action.payload
    default:
      return state
  }
}
/*
export function doc(state = "default", action) {
  switch (action.type) {
    case SET_DOCUMENT:
      return action.payload
    case SAVE_DOCUMENT: //side effect?
      return state
    default:
      return state
  }
}
*/
