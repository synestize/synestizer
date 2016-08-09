import { combineReducers } from 'redux'

import {
  SET_ALL_VIDEO_SOURCES,
  SET_VALID_VIDEO_SOURCE
} from '../../actions/video'

export function videoSources(state=new Map(), action) {
  switch (action.type) {
    case SET_ALL_VIDEO_SOURCES:
      return action.payload
    default:
      return state
  }
}

export function validVideoSource(state=false, action) {
  switch (action.type) {
    case SET_VALID_VIDEO_SOURCE:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
   videoSources,
   validVideoSource,
})
