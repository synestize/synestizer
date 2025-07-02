import { combineReducers } from 'redux'
import {
  setAllMidiSourceDevices,
  setValidMidiSourceDevice,
  setAllMidiSinkDevices,
  setValidMidiSinkDevice
} from '../../features/midi/midiSlice'

export function sources(state=new Map(), action) {
  switch (action.type) {
    case setAllMidiSourceDevices.type:
      return action.payload
    default:
      return state
  }
}

export function validSource(state=false, {type, payload}) {
  switch (type) {
    case setValidMidiSourceDevice.type:
      return payload
    default:
      return state
  }
}

export function sinks(state=new Map(), action) {
  switch (action.type) {
    case setAllMidiSinkDevices.type:
      return action.payload
    default:
      return state
  }
}

export function validSink(state=false, action) {
  switch (action.type) {
    case setValidMidiSinkDevice.type:
      return action.payload
    default:
      return state
  }
}

//Now put all these together.
export default combineReducers({
  sources,
  validSource,
  sinks,
  validSink,
})
