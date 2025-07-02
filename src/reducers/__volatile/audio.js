import { combineReducers } from 'redux'
import {
  setAllAudioSourceDevices,
  setValidAudioSourceDevice,
  setAllAudioSinkDevices,
  setValidAudioSinkDevice,
  setAllAudioSinkControlActualValues,
  setAudioReady
} from '../../features/audio/audioSlice'

export function sources(state=new Map(), {type, payload}) {
  switch (type) {
    case setAllAudioSourceDevices.type:
      return payload
    default:
      return state
  }
}

export function validSource(state=false, {type, payload}) {
  switch (type) {
    case setValidAudioSourceDevice.type:
      return payload
    default:
      return state
  }
}

export function sinks(state=new Map(), {type, payload}) {
  switch (type) {
    case setAllAudioSinkDevices.type:
      return payload
    default:
      return state
  }
}

export function validSink(state=false, {type, payload}) {
  switch (type) {
    case setValidAudioSinkDevice.type:
      return payload
    default:
      return state
  }
}

export function audioReady(state=false, {type, payload}) {
  switch (type) {
    case setAudioReady.type:
      return payload
    default:
      return state
  }
}

export function sinkActualValues(state={}, {type, payload}) {
  let next;
  switch (type) {
    case setAllAudioSinkControlActualValues.type:
      return {...state, ...payload}
    default:
      return state
  }
}

// RECORD functionality removed - would need to be added to audioSlice if needed

//Now put all these together.
export default combineReducers({
  sources,
  validSource,
  sinks,
  validSink,
  audioReady,
  sinkActualValues,
})
