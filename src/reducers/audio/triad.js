import { combineReducers } from 'redux'

import {
  TOGGLE_TRIAD_MUTE,
} from '../../actions/audio'


export function mute(state=true, {type, payload}) {
  switch (type) {
    case TOGGLE_TRIAD_MUTE:
      return !state
    default:
      return state
  }
}

const triad = combineReducers({
  mute,
})

export default triad
