import { SET_VISIBLE_PANE } from '../actions/app'

export function visiblePane(state = "welcome", action) {
  switch (action.type) {
    case SET_VISIBLE_PANE:
      return action.payload
    default:
      return state
  }
}
