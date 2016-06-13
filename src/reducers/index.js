import { combineReducers } from 'redux'

import video from './video'
import visiblePane from './panes'

export default combineReducers({
  video,
  visiblePane
})
