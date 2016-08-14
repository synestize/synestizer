'use strict';
import { combineReducers } from 'redux'
import {
  SET_CURRENT_VIDEO_SOURCE,
} from '../actions/video'

import {
  addSourceSignal,
  removeSourceSignal,
  setSourceSignalValue,
  setAllSourceSignalValues,
  addSinkSignal,
  removeSinkSignal,
  setSinkSignalValue,
  setAllSinkSignalValues,
  setSourceSinkScale,
  setSinkBias,
} from '../actions/signal'


export function currentVideoSource(state="", {type, payload}) {
  switch (type) {
    case SET_CURRENT_VIDEO_SOURCE:
      return payload
    default:
      return state
  }
}

const video = combineReducers({
   currentVideoSource,
})

export default video
