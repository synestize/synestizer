import { combineReducers } from 'redux'
import { union, difference, intersection } from '../lib/collections'

import {
  SET_AUDIO_SOURCE_DEVICE,
  SET_AUDIO_SOURCE_CHANNEL,
  ADD_AUDIO_SOURCE_CONTROL,
  REMOVE_AUDIO_SOURCE_CONTROL,
  SET_AUDIO_SINK_DEVICE,
  SET_AUDIO_SINK_CHANNEL,
  ADD_AUDIO_SINK_CONTROL,
  REMOVE_AUDIO_SINK_CONTROL,
  TOGGLE_SOLO_AUDIO_SINK_CONTROL,
} from '../actions/audio'

export function sourceDevice(state="default", {type, payload}) {
  switch (type) {
    case SET_AUDIO_SOURCE_DEVICE:
      return payload
    default:
      return state
  }
}

export function sourceChannel(state=0, action) {
  switch (action.type) {
    case SET_AUDIO_SOURCE_CHANNEL:
      return parseInt(action.payload)
    default:
      return state
  }
}

export function sourceCCs(state=[], {type, payload}) {
  let next = state
  switch (type) {
    case ADD_AUDIO_SOURCE_CONTROL:
      if (payload===undefined){
        next = union(state, [(Math.max(-1, ...state)+1)%128])
      } else {
        next = union(state, [parseInt(payload)])
      }
      break
    case REMOVE_AUDIO_SOURCE_CONTROL:
      next = difference(state, [parseInt(payload)])
      break
  }
  return next
}

export function sinkDevice(state="default", {type, payload}) {
  switch (type) {
    case SET_AUDIO_SINK_DEVICE:
      return payload
    default:
      return state
  }
}

export function sinkChannel(state=0, {type, payload}) {
  switch (type) {
    case SET_AUDIO_SINK_CHANNEL:
      return parseInt(payload)
    default:
      return state
  }
}

export function sinkCCs(state=[], {type, payload}) {
  switch (type) {
    case ADD_AUDIO_SINK_CONTROL:
      if (payload===undefined){
        let next = payload;
        return union(state, [Math.max(-1, ...state)+1])
      } else {
        return union(state, [parseInt(payload)])
      }
    case REMOVE_AUDIO_SINK_CONTROL:
      return difference(state, [parseInt(payload)])
    default:
      return state
  }
}

export function sinkSoloCC(state=null, {type, payload}) {
  switch (type) {
    case TOGGLE_SOLO_AUDIO_SINK_CONTROL:
      let newsolo = parseInt(payload);
      return (newsolo===state) ? null : newsolo;
    default:
      return state
  }
}

const audio = combineReducers({
   sourceDevice,
   sourceChannel,
   sourceCCs,
   sinkDevice,
   sinkChannel,
   sinkCCs,
   sinkSoloCC,
})

export default audio
