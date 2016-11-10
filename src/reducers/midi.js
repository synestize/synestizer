import { combineReducers } from 'redux'
import { union, difference, intersection } from '../lib/collections'
import { midiInStreamName, midiOutStreamName } from '../io/midi/util'

import {
  SET_MIDI_SOURCE_DEVICE,
  SET_MIDI_SOURCE_CHANNEL,
  ADD_MIDI_SOURCE_CC,
  REMOVE_MIDI_SOURCE_CC,
  SET_MIDI_SINK_DEVICE,
  SET_MIDI_SINK_CHANNEL,
  ADD_MIDI_SINK_CC,
  REMOVE_MIDI_SINK_CC,
  TOGGLE_SOLO_MIDI_SINK_CC,
} from '../actions/midi'

export function sourceDevice(state="", {type, payload}) {
  switch (type) {
    case SET_MIDI_SOURCE_DEVICE:
      return payload !== undefined ? payload : state
    default:
      return state
  }
}

export function sourceChannel(state=0, action) {
  switch (action.type) {
    case SET_MIDI_SOURCE_CHANNEL:
      return parseInt(action.payload)
    default:
      return state
  }
}

export function sourceCCs(state=[], {type, payload}) {
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
      next = difference(state, [parseInt(payload)])
      break
  }
  return next
}

export function sourceCCMap(state={}, {type, payload}) {
  let newState, key;
  switch (type) {
    case ADD_MIDI_SOURCE_CC:
      newState = {...state}
      key = midiInStreamName(payload)[0];
      newState[key] = payload
      return newState
    case REMOVE_MIDI_SOURCE_CC:
      newState = {...state}
      key = midiInStreamName(payload)[0];
      delete newState[key]
      return newState
    default:
      return state
  }
  return newState
}

export function sinkDevice(state="", {type, payload}) {
  switch (type) {
    case SET_MIDI_SINK_DEVICE:
      return payload !== undefined ? payload : state
    default:
      return state
  }
}

export function sinkChannel(state=1, {type, payload}) {
  switch (type) {
    case SET_MIDI_SINK_CHANNEL:
      return parseInt(payload)
    default:
      return state
  }
}

export function sinkCCs(state=[], {type, payload}) {
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
    default:
      return state
  }
}

export function sinkCCMap(state={}, {type, payload}) {
  let newState, key;
  switch (type) {
    case ADD_MIDI_SINK_CC:
      newState = {...state}
      key = midiOutStreamName(payload)[0];
      newState[key] = payload
      return newState
    case REMOVE_MIDI_SINK_CC:
      newState = {...state}
      key = midiOutStreamName(payload)[0];
      delete newState[key]
      return newState
    default:
      return state
  }
  return newState
}

export function sinkSoloCC(state=null, {type, payload}) {
  switch (type) {
    case TOGGLE_SOLO_MIDI_SINK_CC:
      let newsolo = parseInt(payload);
      return (newsolo===state) ? null : newsolo;
    default:
      return state
  }
}

const midi = combineReducers({
   sourceDevice,
   sourceChannel,
   sourceCCs,
   sourceCCMap,
   sinkDevice,
   sinkChannel,
   sinkCCs,
   sinkCCMap,
   sinkSoloCC,
})

export default midi
