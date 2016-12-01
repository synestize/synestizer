import { combineReducers } from 'redux'
import {
  SET_ALL_MIDI_SOURCE_DEVICES,
  SET_VALID_MIDI_SOURCE_DEVICE,
  SET_ALL_MIDI_SINK_DEVICES,
  SET_VALID_MIDI_SINK_DEVICE,
} from '../../actions/midi'

export function sources(state=new Map(), action) {
  switch (action.type) {
    case SET_ALL_MIDI_SOURCE_DEVICES:
      return action.payload
    default:
      return state
  }
}

export function validSource(state=false, {type, payload}) {
  switch (type) {
    case SET_VALID_MIDI_SOURCE_DEVICE:
      return payload
    default:
      return state
  }
}

export function sinks(state=new Map(), action) {
  switch (action.type) {
    case SET_ALL_MIDI_SINK_DEVICES:
      return action.payload
    default:
      return state
  }
}

export function validSink(state=false, action) {
  switch (action.type) {
    case SET_VALID_MIDI_SINK_DEVICE:
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
