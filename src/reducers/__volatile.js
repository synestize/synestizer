'use strict';
import { combineReducers } from 'redux'

import { SET_VISIBLE_PANE } from '../actions/app'
import {
  SET_ALL_VIDEO_SOURCES,
  SET_VALID_VIDEO_SOURCE
} from '../actions/video'

import {
  SET_ALL_MIDI_SOURCE_DEVICES,
  SET_VALID_MIDI_SOURCE_DEVICE,
  SET_ALL_MIDI_SINK_DEVICES,
  SET_VALID_MIDI_SINK_DEVICE,
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
    case SET_ALL_MIDI_SOURCE_DEVICES:
      return action.payload
    default:
      return state
  }
}

export function validMidiSource(state=false, action) {
  switch (action.type) {
    case SET_VALID_MIDI_SOURCE_DEVICE:
      return action.payload
    default:
      return state
  }
}

export function midiSinks(state=new Map(), action) {
  switch (action.type) {
    case SET_ALL_MIDI_SINK_DEVICES:
      return action.payload
    default:
      return state
  }
}

export function validMidiSink(state=false, action) {
  switch (action.type) {
    case SET_VALID_MIDI_SINK_DEVICE:
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
  midiSinks,
  validMidiSink,
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
