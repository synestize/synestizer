import { combineReducers } from 'redux'

import video from './video'
import midi from './midi'
import { visiblePane } from './app'

export default combineReducers({
  video,
  visiblePane,
  midi,
})
