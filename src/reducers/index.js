import { combineReducers } from 'redux'

import video from './video'
import midi from './midi'
import __volatile from './__volatile'
import gui from './gui'
import signal from './signal'

export default combineReducers({
  video,
  midi,
  signal,
  gui,
  __volatile
})
