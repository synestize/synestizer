import { combineReducers } from 'redux'

import {
  TOGGLE_BUBBLE_CHAMBER_MUTE,
} from '../../actions/audio'


export function mute(state=true, {type, payload}) {
  switch (type) {
    case TOGGLE_BUBBLE_CHAMBER_MUTE:
      return !state
    default:
      return state
  }
}

const bubbleChamber = combineReducers({
  mute,
})

export default bubbleChamber
