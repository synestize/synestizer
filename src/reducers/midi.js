'use strict';
import { combineReducers } from 'redux'
import { union, difference, intersection } from '../lib/fakesetop'

import {
  SET_CURRENT_MIDI_SOURCE,
  SET_MIDI_SOURCE_CHANNEL,
  ADD_MIDI_SOURCE_CC,
  REMOVE_MIDI_SOURCE_CC,
  SET_MIDI_SOURCE_CC,
} from '../actions/midi'

export function currentMidiSource(state="", action) {
  switch (action.type) {
    case SET_CURRENT_MIDI_SOURCE:
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

export function midiSourceCCs(state=[], action) {
  switch (action.type) {
    case ADD_MIDI_SOURCE_CC:
      return union(state, [action.payload])
    case REMOVE_MIDI_SOURCE_CC:
      return difference(state, [action.payload])
    case SET_MIDI_SOURCE_CC:
      return [...action.payload]
    default:
      return state
  }
}

const midi = combineReducers({
   currentMidiSource,
   midiSourceChannel,
   midiSourceCCs
})

export default midi
