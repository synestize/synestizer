import { combineReducers } from 'redux'

import {
  TOGGLE_BUBBLE_CHAMBER_VOICE_1_MUTE,
  TOGGLE_BUBBLE_CHAMBER_VOICE_2_MUTE,
  TOGGLE_BUBBLE_CHAMBER_VOICE_3_MUTE,
  TOGGLE_BUBBLE_CHAMBER_BASS_MUTE,
  SET_BUBBLE_CHAMBER_VOICE_1_SAMPLE,
  SET_BUBBLE_CHAMBER_VOICE_2_SAMPLE,
  SET_BUBBLE_CHAMBER_VOICE_3_SAMPLE,
  ADD_SAMPLE
} from '../../actions/audio'



function voice1mute(state=false, {type, payload}) {
  switch (type) {
    case TOGGLE_BUBBLE_CHAMBER_VOICE_1_MUTE:
      return !state
    default:
      return state
  }
}
function voice1sample(state='panflute', {type, payload}) {
  switch (type) {
    case SET_BUBBLE_CHAMBER_VOICE_1_SAMPLE:
      return payload
    default:
      return state
  }
}

const voice1 = combineReducers({
  mute: voice1mute,
  sample: voice1sample
})

export function voice2mute(state=false, {type, payload}) {
  switch (type) {
    case TOGGLE_BUBBLE_CHAMBER_VOICE_2_MUTE:
      return !state
    default:
      return state
  }
}

const voice2 = combineReducers({
  mute: voice2mute
})

export function voice3mute(state=false, {type, payload}) {
  switch (type) {
    case TOGGLE_BUBBLE_CHAMBER_VOICE_3_MUTE:
      return !state
    default:
      return state
  }
}

const voice3 = combineReducers({
  mute: voice3mute
})

export function bassmute(state=false, {type, payload}) {
  switch (type) {
    case TOGGLE_BUBBLE_CHAMBER_BASS_MUTE:
      return !state
    default:
      return state
  }
}

const bass = combineReducers({
  mute: bassmute
})

const bubbleChamber = combineReducers({
  voice1,
  voice2,
  voice3,
  bass,
})

export default bubbleChamber
