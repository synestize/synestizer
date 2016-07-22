'use strict';
import { combineReducers } from 'redux'
import { union, difference, intersection } from '../lib/fakesetop'

import {
  SET_MIDI_SOURCE_DEVICE,
  SET_MIDI_SOURCE_CHANNEL,
  ADD_MIDI_SOURCE_CC,
  REMOVE_MIDI_SOURCE_CC,
  SET_MIDI_SOURCE_CCS,
  SWAP_MIDI_SOURCE_CC,
  SET_MIDI_SINK_DEVICE,
  SET_MIDI_SINK_CHANNEL,
  ADD_MIDI_SINK_CC,
  REMOVE_MIDI_SINK_CC,
  SET_MIDI_SINK_CCS,
  SWAP_MIDI_SINK_CC,
  TOGGLE_SOLO_MIDI_SINK_CC,
} from '../actions/midi'

import {
  addSourceStream,
  removeSourceStream,
  setSourceStreamValue,
  setAllSourceStreamValues,
  addSinkStream,
  removeSinkStream,
  setSinkStreamValue,
  setAllSinkStreamValue,
  setSourceSinkScale,
  setSinkBias,
} from '../actions/stream'

export function midiSourceDevice(state="", {type, payload}) {
  switch (type) {
    case SET_MIDI_SOURCE_DEVICE:
      return payload
    default:
      return state
  }
}

export function midiSourceChannel(state=0, action) {
  switch (action.type) {
    case SET_MIDI_SOURCE_CHANNEL:
      return parseInt(action.payload)
    default:
      return state
  }
}

export function midiSourceCCs(state=[0], {type, payload}) {
  console.debug("msccs", type, payload)
  let next = state
  switch (type) {
    case ADD_MIDI_SOURCE_CC:
      if (payload===undefined){
        next = union(state, [(Math.max(-1, ...state)+1)%128])
      } else {
        next = union(state, [parseInt(payload)])
      }
      break
    case REMOVE_MIDI_SOURCE_CC:
      console.debug("msccsdiff", state, [parseInt(payload)])
      next = difference(state, [parseInt(payload)])
      break
    case SET_MIDI_SOURCE_CCS:
      next = [...payload]
      break
    case SWAP_MIDI_SOURCE_CC:
      let [x,y] = payload;
      next = union(difference(state,[parseInt(x)]),[parseInt(y)])
      break
  }
  
  return next
}

export function midiSinkDevice(state="", {type, payload}) {
  switch (type) {
    case SET_MIDI_SINK_DEVICE:
      return payload
    default:
      return state
  }
}

export function midiSinkChannel(state=0, {type, payload}) {
  switch (type) {
    case SET_MIDI_SINK_CHANNEL:
      return parseInt(payload)
    default:
      return state
  }
}

export function midiSinkCCs(state=[0], {type, payload}) {
  switch (type) {
    case ADD_MIDI_SINK_CC:
      if (payload===undefined){
        let next = payload;
        return union(state, [Math.max(-1, ...state)+1])
      } else {
        return union(state, [parseInt(payload)])
      }
    case REMOVE_MIDI_SINK_CC:
      return difference(state, [parseInt(payload)])
    case SET_MIDI_SINK_CCS:
      return [...payload]
    case SWAP_MIDI_SINK_CC:
      let [x,y] = payload;
      return union(difference(state,[parseInt(x)]),[parseInt(y)])
    default:
      return state
  }
}

export function midiSinkSoloCC(state=null, {type, payload}) {
  switch (type) {
    case TOGGLE_SOLO_MIDI_SINK_CC:
      let newsolo = parseInt(payload);
      return (newsolo===state) ? null : newsolo;
    default:
      return state
  }
}

const midi = combineReducers({
   midiSourceDevice,
   midiSourceChannel,
   midiSourceCCs,
   midiSinkDevice,
   midiSinkChannel,
   midiSinkCCs,
   midiSinkSoloCC
})

export default midi
