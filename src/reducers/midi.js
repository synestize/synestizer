'use strict';
import { combineReducers } from 'redux'
import { union, difference, intersection } from '../lib/setop'

import {
  SET_ALL_MIDI_SOURCES,
  SET_CURRENT_MIDI_SOURCE,
  SET_VALID_MIDI_SOURCE,
  SET_MIDI_SOURCE_CHANNEL,
  ADD_MIDI_SOURCE_CC,
  REMOVE_MIDI_SOURCE_CC,
  SET_MIDI_SOURCE_CC,
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

export function midiSourceChannel(state=0, action) {
  switch (action.type) {
    case SET_MIDI_SOURCE_CHANNEL:
      return action.payload
    default:
      return state
  }
}

export function midiSourceCCs(state=new Set([0]), action) {
  switch (action.type) {
    case ADD_MIDI_SOURCE_CC:
      return union(state, [action.payload])
    case REMOVE_MIDI_SOURCE_CC:
      return difference(state, [action.payload])
    case SET_MIDI_SOURCE_CC:
      return new Set(action.payload)
    default:
      return state
  }
}

const midi = combineReducers({
   midiSources,
   currentMidiSource,
   validMidiSource,
   midiSourceChannel,
   midiSourceCCs
})

export default midi
