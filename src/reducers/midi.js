'use strict';
import { combineReducers } from 'redux'

import {
  SET_ALL_MIDI_SOURCES,
  SET_CURRENT_MIDI_SOURCE,
  SET_VALID_MIDI_SOURCE
} from '../actions/midi'

export function midiSources(state=new Map(), action) {
  switch (action.type) {
    case SET_ALL_MIDI_SOURCES:
      return action.payload
    default:
      return state
  }
}

export function currentMidiSource(state="", action) {
  switch (action.type) {
    case SET_CURRENT_MIDI_SOURCE:
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

const midi = combineReducers({
   midiSources,
   currentMidiSource,
   validMidiSource
})

export default midi
