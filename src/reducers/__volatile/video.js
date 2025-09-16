import { combineReducers } from 'redux'

import {
  setAllVideoSources,
  setValidVideoSource
} from '../../features/video/videoSlice'

export function sources(state={}, action) {
  switch (action.type) {
    case setAllVideoSources.type:
      return action.payload
    default:
      return state
  }
}

export function validSource(state=false, action) {
  switch (action.type) {
    case setValidVideoSource.type:
      return action.payload
    default:
      return state
  }
}

export default combineReducers({
   sources,
   validSource,
})
