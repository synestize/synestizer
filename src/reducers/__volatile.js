import { combineReducers } from 'redux'

import midi from './__volatile/midi'
import video from './__volatile/video'

export default combineReducers({
   midi,
   video,
})
