'use strict';
import { combineReducers } from 'redux'

import { SET_VISIBLE_PANE } from '../actions/app'
import {
  SET_ALL_VIDEO_SOURCES,
  SET_VALID_VIDEO_SOURCE
} from '../actions/video'

import {
  SET_ALL_MIDI_SOURCES,
  SET_VALID_MIDI_SOURCE,
} from '../actions/midi'

export function visiblePane(state = "welcome", action) {
  switch (action.type) {
    case SET_VISIBLE_PANE:
      return action.payload
    default:
      return state
  }
}

export function midiSources(state=new Map(), action) {
  switch (action.type) {
    case SET_ALL_MIDI_SOURCES:
      return action.payload
    default:
      return state
  }
}

export function validMidiSource(state=false, action) {
  switch (action.type) {
    case SET_VALID_MIDI_SOURCE:
      return action.payload
    default:
      return state
  }
}

export function videoSources(state=new Map(), action) {
  switch (action.type) {
    case SET_ALL_VIDEO_SOURCES:
      return action.payload
    default:
      return state
  }
}

export function validVideoSource(state=false, action) {
  switch (action.type) {
    case SET_VALID_VIDEO_SOURCE:
      return action.payload
    default:
      return state
  }
}

//Now put all these together.
const midi = combineReducers({
  midiSources,
  validMidiSource,
})

const video = combineReducers({
   videoSources,
   validVideoSource,
})

const __volatile = combineReducers({
   midi,
   video,
   visiblePane
})

export default __volatile
