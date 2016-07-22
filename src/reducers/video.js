'use strict';
import { combineReducers } from 'redux'
import {
  SET_CURRENT_VIDEO_SOURCE,
} from '../actions/video'

import {
  addSourceStream,
  removeSourceStream,
  setSourceStreamValue,
  setAllSourceStreamValues,
  addSinkStream,
  removeSinkStream,
  setSinkStreamValue,
  setAllSinkStreamValue,
  setSourceSinkScale,
  setSinkBias,
} from '../actions/stream'


export function currentVideoSource(state="", action) {
  switch (action.type) {
    case SET_CURRENT_VIDEO_SOURCE:
      return action.payload
    default:
      return state
  }
}

const video = combineReducers({
   currentVideoSource,
})

export default video
