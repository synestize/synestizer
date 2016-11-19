import { combineReducers } from 'redux'
import { genericSinkSignalName } from '../io/signal/util'
import { pad4 } from '../lib/string'

import {
  SET_AUDIO_SOURCE_DEVICE,
  // PUBLISH_AUDIO_SOURCE_SIGNAL,
  // UNPUBLISH_AUDIO_SOURCE_SIGNAL,
  SET_AUDIO_SOURCE_CONTROL,
  SET_AUDIO_SINK_DEVICE,
  ADD_AUDIO_SINK_CONTROL,
  REMOVE_AUDIO_SINK_CONTROL,
  SET_AUDIO_SINK_CONTROL_BIAS,
  SET_AUDIO_SINK_CONTROL_SCALE,
  SET_AUDIO_SINK_CONTROL_SIGNAL,
  SET_MASTER_GAIN,
  SET_MASTER_MUTE,
  TOGGLE_MASTER_MUTE,
  SET_MASTER_TEMPO,
  ADD_SAMPLE,
} from '../actions/audio'
import {
  REMOVE_GENERIC_SINK_SIGNAL,
} from '../actions/signal'
import {
  RESET_TO_DEFAULT
} from '../actions/gui'

import bubbleChamber from './audio/bubbleChamber'


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
    case REMOVE_AUDIO_SINK_CONTROL:
      next = {...state}
      delete next[payload]
      return next
    case ADD_AUDIO_SINK_CONTROL:
    case SET_AUDIO_SINK_CONTROL_BIAS:
    case SET_AUDIO_SINK_CONTROL_SCALE:
    case SET_AUDIO_SINK_CONTROL_SIGNAL:
    case REMOVE_GENERIC_SINK_SIGNAL:
      let {key, val} = payload;
      if (key===undefined) {
        console.warn('Unknown signal key', state, {type, payload})
      }
      next = {...state}
      next[key] = _sinkControl(next[key], {type, payload})
      return next
    case RESET_TO_DEFAULT:
      {
        let signalKeys = Object.keys(
          payload.signal.comboSignalMeta
        ).sort();
        let audioSinkControlKeys = Object.keys(
          payload.audio.sinkControls
        ).sort();
        state = {...state}
        let i = 0;
        for (let controlKey of audioSinkControlKeys){
          let signalKey = signalKeys[i];
          let control = {...(state[controlKey] || {})}
          control.signal = signalKey;
          control.scale = 0.5 * Math.pow((-1),i)
          i = (i + 1) % (signalKeys.length)
          state[controlKey] = control
        }
        return state
      }
    default:
      return state
  }
}

//Individual controls are edited here
export function _sinkControl(
    state,
    {type, payload}
  ) {
  let next;
  let {key, val} = payload;
  if (state===undefined) {
    state = {
      scale: 0.5,
      bias: 0.0,
    }
    state.signal = 'video-moment-' + pad4(Math.floor(Math.random()*15))
  }
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
    case REMOVE_GENERIC_SINK_SIGNAL:
      next = {...state};
      if (next.signal === payload) {
        next.signal = undefined
      }
      return next
    default:
      return state
  }
  return next
}

export function sampleBank(state={}, {type, payload}) {
  switch (type) {
    case ADD_SAMPLE:
      state = {...state}
      state[payload.key] = {
        name: payload.name,
        root: payload.root,
        path: payload.path,
      }
      return state
    default:
      return state
  }
}

export function gain(state=-10, {type, payload}) {
  switch (type) {
    case SET_MASTER_GAIN:
      return payload
    default:
      return state
  }
}

export function mute(state=false, {type, payload}) {
  switch (type) {
    case SET_MASTER_MUTE:
      return payload
    case TOGGLE_MASTER_MUTE:
      return !state
    default:
      return state
  }
}

export function tempo(state=100, {type, payload}) {
  switch (type) {
    case SET_MASTER_TEMPO:
      return payload
    default:
      return state
  }
}

const master = combineReducers({
  gain,
  mute,
  tempo
})

const audio = combineReducers({
   sourceDevice,
   // sourceControlVals,
   sinkDevice,
   sinkControls,
   master,
   bubbleChamber,
   sampleBank
})

export default audio
