import { combineReducers } from 'redux'

import video from './video'
import midi from './midi'
import __volatile from './__volatile'
import stream from './stream'

export default combineReducers({
  video,
  midi,
  stream,
  __volatile
})
