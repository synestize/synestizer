import { combineReducers } from 'redux'

import midi from './__volatile/midi'
import video from './__volatile/video'
import audio from './__volatile/audio'

export default combineReducers({
   midi,
   video,
   audio
})
