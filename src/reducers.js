import { combineReducers } from 'redux'

import video from './reducers/video'
import midi from './reducers/midi'
import __volatile from './reducers/__volatile'
import gui from './reducers/gui'
import signal from './reducers/signal'
import audio from './reducers/audio'

export default combineReducers({
  video,
  midi,
  audio,
  signal,
  gui,
  __volatile
})
