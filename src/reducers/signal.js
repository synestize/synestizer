import { combineReducers } from 'redux'
import { union, difference, intersection } from '../lib/collections'
import {
  addSourceSignal,
  removeSourceSignal,
  addSinkSignal,
  removeSinkSignal,
  ADD_SOURCE_SIGNAL,
  REMOVE_SOURCE_SIGNAL,
  SET_SOURCE_SIGNAL_VALUE,
  SET_ALL_SOURCE_SIGNAL_VALUES,
  ADD_SINK_SIGNAL,
  REMOVE_SINK_SIGNAL,
  SET_SINK_SIGNAL_VALUE,
  SET_ALL_SINK_SIGNAL_VALUES,
  SET_SOURCE_SINK_SCALE,
  SET_SINK_BIAS,
} from '../actions/signal'
import { midiStreamName } from '../io/midi/util'
import {
  ADD_MIDI_SOURCE_CC,
  REMOVE_MIDI_SOURCE_CC,
  ADD_MIDI_SINK_CC,
  REMOVE_MIDI_SINK_CC,
} from '../actions/midi'

export function sourceSignalMeta(state={}, {type, payload}) {
  switch (type) {
    case ADD_SOURCE_SIGNAL:
      {
        let [key, name] = payload;
        state = {...state}
        state[key] = name
        return state
      }
    case ADD_MIDI_SOURCE_CC:
      {
        let [key, name] = midiStreamName(payload)
        state = {...state}
        state[key] = name
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
        let [key, name] = midiStreamName(payload)
        state = {...state}
        delete state[key]
        return state
      }
    default:
      return state
  }
}

export function sinkSignalMeta(state={}, {type, payload}) {
  switch (type) {
    case ADD_SINK_SIGNAL:
      {
        let [key, name] = payload;
        state = {...state}
        state[key] = name
        return state
      }
    case ADD_MIDI_SINK_CC:
      {
        let [key, name] = midiStreamName(payload)
        state = {...state}
        state[key] = name
        return state
      }
    case REMOVE_SINK_SIGNAL:
      {
        let state = {...state}
        delete state[payload]
        return state
      }
    case REMOVE_MIDI_SINK_CC:
      {
        let [key, name] = midiStreamName(payload)
        state = {...state}
        delete state[key]
        return state
      }
    default:
      return state
  }
}

export function sourceSignalValues(state={}, {type, payload}) {
  switch (type) {
    case ADD_SOURCE_SIGNAL:
      {
        let [key, val] = payload;
        state = {...state}
        state[key] = 0.0
        return state
      }
    case ADD_MIDI_SOURCE_CC:
      {
        let [key, name] = midiStreamName(payload)
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
        let [key, name] = midiStreamName(payload)
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
        let [key, val] = payload;
        state = {...state}
        state[key] = 0.0
        return state
      }
    case ADD_MIDI_SOURCE_CC:
      {
        let [key, name] = midiStreamName(payload)
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
        let [key, name] = midiStreamName(payload)
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

export function sourceSinkScale(state={}, {type, payload}) {
  switch (type) {
    case SET_SOURCE_SINK_SCALE:
      {
        let [sourceKey, sinkKey, scale] = payload
        let mapkey = (sourceKey + '/' + sinkKey)
        state = {...state}
        state[mapkey] = scale
        if (scale===0) { delete state[mapkey] }
        return state
      }
    case REMOVE_MIDI_SINK_CC:
      {
        let [key, name] = midiStreamName(payload)
        return sourceSinkScale(state, removeSinkSignal(key))
      }
    case REMOVE_SINK_SIGNAL:
      {
        let state = {...state}
        for (let key of Object.keys(state)) {
          let [sourceKey, sinkKey] = key;
          if (sinkKey===payload) {
            delete state[key]
          }
        }
        return state
      }
    case REMOVE_MIDI_SOURCE_CC:
      {
        let [key, name] = midiStreamName(payload)
        return sourceSinkScale(state, removeSourceSignal(key))
      }
    case REMOVE_SOURCE_SIGNAL:
      {
        let state = {...state}
        for (let key of Object.keys(state)) {
          let [sourceKey, sinkKey] = key;
          if (sourceKey===payload) {
            delete state[key]
          }
        }
        return state
      }
    default:
      return state
  }
}

export function sinkBias(state={}, {type, payload}) {
  switch (type) {
    case ADD_SINK_SIGNAL:
    {
      let [key, name] = payload;
      state = {...state}
      state[key] = 0.0
      return state
    }
    case REMOVE_SINK_SIGNAL:
    {
      let state = {...state}
      delete state[payload]
    }
    case SET_SINK_BIAS:
    {
      let [key, val] = payload;
      state = {...state}
      state[key] = val
      return state
    }
    default:
      return state
  }
}

const stream = combineReducers({
   sourceSignalMeta,
   sourceSignalValues,
   sinkSignalMeta,
   sinkSignalValues,
   sourceSinkScale,
   sinkBias
})

export default stream
