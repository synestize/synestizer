import { combineReducers } from 'redux'

import video from './video'
import midi from './midi'
import __volatile from './__volatile'

export default combineReducers({
  video,
  midi,
  __volatile
})
