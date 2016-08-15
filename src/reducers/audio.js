import { combineReducers } from 'redux'

import {
  SET_AUDIO_SOURCE_DEVICE,
  SET_AUDIO_SOURCE_CHANNEL,
  PUBLISH_AUDIO_SOURCE_CONTROL,
  UNPUBLISH_AUDIO_SOURCE_CONTROL,
  SET_AUDIO_SOURCE_CONTROL,
  SET_AUDIO_SINK_DEVICE,
  SET_AUDIO_SINK_CHANNEL,
  ADD_AUDIO_SINK_CONTROL,
  REMOVE_AUDIO_SINK_CONTROL,
  PUBLISH_AUDIO_SINK_CONTROL,
  UNPUBLISH_AUDIO_SINK_CONTROL,
  SET_AUDIO_SINK_CONTROL,
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
/*
export function sourceControls(state={}, {type, payload}) {
  let next = {...state}
  switch (type) {
    case PUBLISH_AUDIO_SOURCE_CONTROL:
      next[payload] = 0.0
      break
    case UNPUBLISH_AUDIO_SOURCE_CONTROL:
      delete next[payload]
  }
  return next
}
*/
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

export function sinkControlVals(state={}, {type, payload}) {
  let next = state;
  switch (type) {
    case ADD_AUDIO_SINK_CONTROL:
      next = {...state}
      next[payload.key] = 0.0
      break
    case REMOVE_AUDIO_SINK_CONTROL:
      next = {...state}
      delete next[payload.key]
    case SET_AUDIO_SINK_CONTROL:
      next = {...state}
      next[payload.key] = payload.val
  }
  return next
}

export function sinkControlMeta(state={}, {type, payload}) {
  let next = state;
  switch (type) {
    case ADD_AUDIO_SINK_CONTROL:
      next = {...state}
      next[payload.key] = payload
      break
    case REMOVE_AUDIO_SINK_CONTROL:
      next = {...state}
      delete next[payload.key]
  }
  return next
}


const audio = combineReducers({
   sourceDevice,
   sourceChannel,
  //  sourceControlVals,
   sinkDevice,
   sinkChannel,
   sinkControlVals,
})

export default audio
