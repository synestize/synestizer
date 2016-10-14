import { combineReducers } from 'redux'

import {
  TOGGLE_BUBBLE_CHAMBER_VOICE_1_MUTE,
  TOGGLE_BUBBLE_CHAMBER_VOICE_2_MUTE,
  TOGGLE_BUBBLE_CHAMBER_VOICE_3_MUTE,
  TOGGLE_BUBBLE_CHAMBER_VOICE_4_MUTE,
} from '../../actions/audio'


export function voice1mute(state=true, {type, payload}) {
  switch (type) {
    case TOGGLE_BUBBLE_CHAMBER_VOICE_1_MUTE:
      return !state
    default:
      return state
  }
}
export function voice2mute(state=true, {type, payload}) {
  switch (type) {
    case TOGGLE_BUBBLE_CHAMBER_VOICE_2_MUTE:
      return !state
    default:
      return state
  }
}
export function voice3mute(state=true, {type, payload}) {
  switch (type) {
    case TOGGLE_BUBBLE_CHAMBER_VOICE_3_MUTE:
      return !state
    default:
      return state
  }
}
export function voice4mute(state=true, {type, payload}) {
  switch (type) {
    case TOGGLE_BUBBLE_CHAMBER_VOICE_4_MUTE:
      return !state
    default:
      return state
  }
}

const bubbleChamber = combineReducers({
  voice1mute,
  voice2mute,
  voice3mute,
  voice4mute,
})

export default bubbleChamber
