import { combineReducers } from 'redux'
import {
  SET_ALL_AUDIO_SOURCE_DEVICES,
  SET_VALID_AUDIO_SOURCE_DEVICE,
  SET_ALL_AUDIO_SINK_DEVICES,
  SET_VALID_AUDIO_SINK_DEVICE,
  SET_AUDIO_SINK_CONTROL_ACTUAL_VALUE,
  SET_ALL_AUDIO_SINK_CONTROL_ACTUAL_VALUES,
  SET_AUDIO_READY,
  RECORD_BUFFER,
  RECORD
} from '../../actions/audio'

export function sources(state=new Map(), {type, payload}) {
  switch (type) {
    case SET_ALL_AUDIO_SOURCE_DEVICES:
      return payload
    default:
      return state
  }
}

export function validSource(state=false, {type, payload}) {
  switch (type) {
    case SET_VALID_AUDIO_SOURCE_DEVICE:
      return payload
    default:
      return state
  }
}

export function sinks(state=new Map(), {type, payload}) {
  switch (type) {
    case SET_ALL_AUDIO_SINK_DEVICES:
      return payload
    default:
      return state
  }
}

export function validSink(state=false, {type, payload}) {
  switch (type) {
    case SET_VALID_AUDIO_SINK_DEVICE:
      return payload
    default:
      return state
  }
}

export function audioReady(state=false, {type, payload}) {
  switch (type) {
    case SET_AUDIO_READY:
      return payload
    default:
      return state
  }
}

export function sinkActualValues(state={}, {type, payload}) {
  let next;
  switch (type) {
    case SET_AUDIO_SINK_CONTROL_ACTUAL_VALUE:
      next = {...state};
      next[payload[key]] = payload[val]
      return next
    case SET_ALL_AUDIO_SINK_CONTROL_ACTUAL_VALUES:
      return {...state, ...payload}
    default:
      return state
  }
}

function recording(state=false, {type, payload}) {
  switch (type) {
    case RECORD:
      return payload
    default:
      return state
  }
}

function recordBuffer(state='_user_1', {type, payload}) {
  switch (type) {
    case RECORD_BUFFER:
      return payload
    default:
      return state
  }
}
const record = combineReducers({
  recording,
  recordBuffer,
})

//Now put all these together.
export default combineReducers({
  sources,
  validSource,
  sinks,
  validSink,
  audioReady,
  sinkActualValues
})
