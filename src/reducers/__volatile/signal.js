import { combineReducers } from 'redux'
import { union, difference, intersection } from '../../lib/collections'
import {
  ADD_SOURCE_SIGNAL,
  REMOVE_SOURCE_SIGNAL,
  SET_SOURCE_SIGNAL_VALUE,
  SET_ALL_SOURCE_SIGNAL_VALUES,
  ADD_SINK_SIGNAL,
  REMOVE_SINK_SIGNAL,
  SET_SINK_SIGNAL_VALUE,
  SET_ALL_SINK_SIGNAL_VALUES,
  SET_SINK_BIAS,
} from '../../actions/signal'
import { midiInStreamName, midiOutStreamName} from '../../io/midi/util'
import {
  ADD_MIDI_SOURCE_CC,
  REMOVE_MIDI_SOURCE_CC,
  ADD_MIDI_SINK_CC,
  REMOVE_MIDI_SINK_CC,
} from '../../actions/midi'

export function sourceSignalValues(state={}, {type, payload}) {
  switch (type) {
    case ADD_SOURCE_SIGNAL:
      {
        state = {...state}
        state[payload.key] = 0.0
        return state
      }
    case ADD_MIDI_SOURCE_CC:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        state[key] = 0.0
        return state
      }
    case REMOVE_SOURCE_SIGNAL:
      {
        let state = {...state}
        delete state[payload]
        return state
      }
    case REMOVE_MIDI_SOURCE_CC:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        delete state[key]
        return state
      }
    case SET_SOURCE_SIGNAL_VALUE:
      {
        let [key, val] = payload;
        state = {...state}
        state[key] = val
        return state
      }
    case SET_ALL_SOURCE_SIGNAL_VALUES:
      return { ...state, ...payload };
    default:
      return state
  }
}

export function sinkSignalValues(state={}, {type, payload}) {
  switch (type) {
    case ADD_SOURCE_SIGNAL:
      {
        state = {...state}
        state[payload.key] = 0.0
        return state
      }
    case ADD_MIDI_SOURCE_CC:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        state[key] = 0.0
        return state
      }
    case REMOVE_SOURCE_SIGNAL:
      {
        let state = {...state}
        delete state[payload]
        return state
      }
    case REMOVE_MIDI_SOURCE_CC:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        delete state[key]
        return state
      }
    case SET_SOURCE_SIGNAL_VALUE:
      {
        let [key, val] = payload;
        state = {...state}
        state[key] = val
        return state
      }
    case SET_ALL_SINK_SIGNAL_VALUES:
      return { ...state, ...payload };
    default:
      return state
  }
}

export function comboSignalValues(state={}, {type, payload}) {
  switch (type) {
    case ADD_SOURCE_SIGNAL:
      {
        state = {...state}
        state[payload.key] = 0.0
        return state
      }
    case ADD_MIDI_SOURCE_CC:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        state[key] = 0.0
        return state
      }
    case REMOVE_SOURCE_SIGNAL:
      {
        let state = {...state}
        delete state[payload]
        return state
      }
    case REMOVE_MIDI_SOURCE_CC:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        delete state[key]
        return state
      }
    case SET_SOURCE_SIGNAL_VALUE:
      {
        let [key, val] = payload;
        state = {...state}
        state[key] = val
        return state
      }
    case SET_ALL_SOURCE_SIGNAL_VALUES:
      return { ...state, ...payload };
    case ADD_SOURCE_SIGNAL:
      {
        state = {...state}
        state[payload.key] = 0.0
        return state
      }
    case ADD_MIDI_SOURCE_CC:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        state[key] = 0.0
        return state
      }
    case REMOVE_SOURCE_SIGNAL:
      {
        let state = {...state}
        delete state[payload]
        return state
      }
    case REMOVE_MIDI_SOURCE_CC:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        delete state[key]
        return state
      }
    case SET_SOURCE_SIGNAL_VALUE:
      {
        let [key, val] = payload;
        state = {...state}
        state[key] = val
        return state
      }
    case SET_ALL_SINK_SIGNAL_VALUES:
      return { ...state, ...payload };
    default:
      return state
  }
}


const stream = combineReducers({
   sourceSignalValues,
   sinkSignalValues,
   comboSignalValues,
})

export default stream
