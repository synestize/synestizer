import { combineReducers } from 'redux'
import {
  SET_ALL_AUDIO_SOURCE_DEVICES,
  SET_VALID_AUDIO_SOURCE_DEVICE,
  SET_ALL_AUDIO_SINK_DEVICES,
  SET_VALID_AUDIO_SINK_DEVICE
} from '../../actions/audio'

export function sources(state=new Map(), action) {
  switch (action.type) {
    case SET_ALL_AUDIO_SOURCE_DEVICES:
      return action.payload
    default:
      return state
  }
}

export function validSource(state=false, action) {
  switch (action.type) {
    case SET_VALID_AUDIO_SOURCE_DEVICE:
      return action.payload
    default:
      return state
  }
}

export function sinks(state=new Map(), action) {
  switch (action.type) {
    case SET_ALL_AUDIO_SINK_DEVICES:
      return action.payload
    default:
      return state
  }
}

export function validSink(state=false, action) {
  switch (action.type) {
    case SET_VALID_AUDIO_SINK_DEVICE:
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
