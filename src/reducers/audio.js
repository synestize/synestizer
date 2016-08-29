import { combineReducers } from 'redux'
import { audioSinkStreamName } from '../io/audio/util'

import {
  SET_AUDIO_SOURCE_DEVICE,
  // PUBLISH_AUDIO_SOURCE_SIGNAL,
  // UNPUBLISH_AUDIO_SOURCE_SIGNAL,
  SET_AUDIO_SOURCE_CONTROL,
  SET_AUDIO_SINK_DEVICE,
  ADD_AUDIO_SINK_CONTROL,
  REMOVE_AUDIO_SINK_CONTROL,
  PUBLISH_AUDIO_SINK_SIGNAL,
  UNPUBLISH_AUDIO_SINK_SIGNAL,
  SET_N_AUDIO_SINK_SIGNALS,
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
export function nSinkControlSignals(state=6, {type, payload}) {
  switch (type) {
    case SET_N_AUDIO_SINK_SIGNALS:
      return payload
    default:
      return state
  }
}
export function sinkControls(state={}, {type, payload}) {
  let next = state;
  switch (type) {
    case REMOVE_AUDIO_SINK_CONTROL:
      next = {...state}
      delete next[payload]
      return next
    case ADD_AUDIO_SINK_CONTROL:
    case SET_AUDIO_SINK_CONTROL_BIAS:
    case SET_AUDIO_SINK_CONTROL_SCALE:
    case SET_AUDIO_SINK_CONTROL_SIGNAL:
    case UNPUBLISH_AUDIO_SINK_SIGNAL:
      let {key, val} = payload;
      if (key===undefined) {
        console.warn('arsebastard!', state, {type, payload})
      }
      next = {...state}
      next[key] = _sinkControl(next[key], {type, payload})
      return next
    default:
      return state
  }
}

//Individual controls are edited here
export function _sinkControl(
    state={},
    {type, payload}
  ) {
  let next;
  let {key, val} = payload;
  switch (type) {
    case ADD_AUDIO_SINK_CONTROL:
      next = {...state, ...payload}
      return next
    case SET_AUDIO_SINK_CONTROL_BIAS:
      next = {...state};
      next.bias = val
      return next
    case SET_AUDIO_SINK_CONTROL_SCALE:
      next = {...state};
      next.scale = val
      return next
    case SET_AUDIO_SINK_CONTROL_SIGNAL:
      next = {...state};
      next.signal = val
      return next
    case UNPUBLISH_AUDIO_SINK_SIGNAL:
      next = {...state};
      if (next.signal === payload) {
        next.signal = null
      }
      return next
    default:
      return state
  }
  return next
}

export function sinkControlSignals(state={}, {type, payload}) {
  let next, key, val;
  switch (type) {
    case PUBLISH_AUDIO_SINK_SIGNAL:
      next = {...state};
      [key, val] = audioSinkStreamName(payload);
      next[key] = val
      return next
    case UNPUBLISH_AUDIO_SINK_SIGNAL:
      next = {...state};
      [key, val] = audioSinkStreamName(payload);
      delete next[key]
      return next
    default:
      return state
  }
}
function ensembles(state={}, {type, payload}) {
  let next = state;
  switch (type) {
    case ADD_ENSEMBLE:
      next = {...state}
      next[payload.key] = payload
      break
    default:
      return state
  }
  return next
}

const audio = combineReducers({
   sourceDevice,
  //  sourceControlVals,
   sinkDevice,
   sinkControls,
   nSinkControlSignals,
   sinkControlSignals,
   ensembles,
})

export default audio
