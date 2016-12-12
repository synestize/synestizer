import { combineReducers } from 'redux'

import video from './reducers/video'
import midi from './reducers/midi'
import __volatile from './reducers/__volatile'
import gui from './reducers/gui'
import signal from './reducers/signal'
import audio from './reducers/audio'

import {
  RESET_TO_NOTHING,
  LOAD
} from './actions/app'

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
    case LOAD:
      // console.debug('LOAD0', action.payload)
      let updates = JSON.parse(action.payload) || {};
      let newState = {...state, ...updates};
      // console.debug('LOAD1', newState)
      return newState;
    default:
      return partialReducer(state, action)
  }
}
