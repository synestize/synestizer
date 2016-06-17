import { combineReducers } from 'redux'

import video from './video'
import visiblePane from './app'

export default combineReducers({
  video,
  visiblePane
})
