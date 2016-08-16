import { combineReducers } from 'redux'

import {
  SET_AUDIO_SOURCE_DEVICE,
  PUBLISH_AUDIO_SOURCE_CONTROL,
  UNPUBLISH_AUDIO_SOURCE_CONTROL,
  SET_AUDIO_SOURCE_CONTROL,
  SET_AUDIO_SINK_DEVICE,
  ADD_AUDIO_SINK_CONTROL,
  REMOVE_AUDIO_SINK_CONTROL,
  PUBLISH_AUDIO_SINK_CONTROL,
  UNPUBLISH_AUDIO_SINK_CONTROL,
  SET_AUDIO_SINK_CONTROL_NOMINAL_VALUE,
  ADD_ENSEMBLE
} from '../actions/audio'

export function sourceDevice(state="default", {type, payload}) {
  switch (type) {
    case SET_AUDIO_SOURCE_DEVICE:
      return payload
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

export function sinkControlNominalVals(state={}, {type, payload}) {
  let next = state;
  switch (type) {
    case ADD_AUDIO_SINK_CONTROL:
      next = {...state}
      next[payload.key] = 0.0
      break
    case REMOVE_AUDIO_SINK_CONTROL:
      next = {...state}
      delete next[payload.key]
    case SET_AUDIO_SINK_CONTROL_NOMINAL_VALUE:
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

function ensembles(state={}, {type, payload}) {
  let next = state;
  switch (type) {
    case ADD_ENSEMBLE:
      next = {...state}
      next[payload.key] = payload
      break
  }
  return next
}

const audio = combineReducers({
   sourceDevice,
  //  sourceControlVals,
   sinkDevice,
   sinkControlNominalVals,
})

export default audio
