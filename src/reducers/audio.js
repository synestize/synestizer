import { combineReducers } from 'redux'

import {
  SET_AUDIO_SOURCE_DEVICE,
  PUBLISH_AUDIO_SOURCE_SIGNAL,
  UNPUBLISH_AUDIO_SOURCE_SIGNAL,
  SET_AUDIO_SOURCE_CONTROL,
  SET_AUDIO_SINK_DEVICE,
  ADD_AUDIO_SINK_CONTROL,
  REMOVE_AUDIO_SINK_CONTROL,
  PUBLISH_AUDIO_SINK_SIGNAL,
  UNPUBLISH_AUDIO_SINK_SIGNAL,
  SET_AUDIO_SINK_CONTROL_BIAS,
  SET_AUDIO_SINK_CONTROL_SCALE,
  SET_AUDIO_SINK_CONTROL_SIGNAL,
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
    case PUBLISH_AUDIO_SOURCE_SIGNAL:
      next[payload] = 0.0
      break
    case UNPUBLISH_AUDIO_SOURCE_SIGNAL:
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

export function sinkControls(state={}, {type, payload}) {
  let next = state;
  switch (type) {
    case ADD_AUDIO_SINK_CONTROL:
      next = {...state}
      next[payload.key] = payload
      return next
    case REMOVE_AUDIO_SINK_CONTROL:
      next = {...state}
      delete next[payload]
      return next
    case SET_AUDIO_SINK_CONTROL_BIAS:
    case SET_AUDIO_SINK_CONTROL_SCALE:
      let {key, val} = payload;
      next = {...state}
      next[key] = _sinkControl(next[key], {type, payload})
      return next
    default:
      return state
  }
}

//Only individual controls are edited here
export function _sinkControl(state={}, {type, payload}) {
  let next = {...state};
  let {key, val} = payload;
  switch (type) {
    case SET_AUDIO_SINK_CONTROL_BIAS:
      next.bias = val
      break
    case SET_AUDIO_SINK_CONTROL_SCALE:
      next.scale = val
      break
  }
  return next
}

export function sinkControlSignal(state={}, {type, payload}) {
  switch (type) {
    case SET_AUDIO_SINK_CONTROL_SIGNAL:
      let next = {...state};
      let {key, val} = payload;
      next[val] = key
      return next
  }
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
   sinkControls,
})

export default audio
