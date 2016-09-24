import { combineReducers } from 'redux'

import video from './reducers/video'
import midi from './reducers/midi'
import __volatile from './reducers/__volatile'
import gui from './reducers/gui'
import signal from './reducers/signal'
import audio from './reducers/audio'
import {
  RESET_TO_NOTHING
} from './actions/gui'

const partialReducer = combineReducers({
  video,
  midi,
  audio,
  signal,
  gui,
  __volatile
})

export default function (state={}, action) {
  switch (action.type) {
    case RESET_TO_NOTHING:
      return partialReducer(undefined, action)
    default:
      return partialReducer(state, action)
  }
}
