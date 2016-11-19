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
  ADD_SINK_SIGNAL,
  REMOVE_SINK_SIGNAL,
  SET_SINK_SIGNAL_VALUE,
  SET_SOURCE_SINK_SCALE,
  SET_SINK_BIAS,
  ADD_GENERIC_SINK_SIGNAL,
  REMOVE_GENERIC_SINK_SIGNAL,
  SET_N_GENERIC_SINK_SIGNALS,
} from '../actions/signal'
import { midiInStreamName, midiOutStreamName } from '../io/midi/util'
import {
  ADD_MIDI_SOURCE_CC,
  REMOVE_MIDI_SOURCE_CC,
  ADD_MIDI_SINK_CC,
  REMOVE_MIDI_SINK_CC,
} from '../actions/midi'
import {
  RANDOMIZE
} from '../actions/gui'
import { genericSinkSignalName } from '../io/signal/util'


export function sourceSignalMeta(state={}, {type, payload}) {
  switch (type) {
    case ADD_SOURCE_SIGNAL:
      {
        state = {...state}
        state[payload.key] = payload
        return state
      }
    case ADD_MIDI_SOURCE_CC:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        state[key] = {name, owner: "MIDI"}
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
    default:
      return state
  }
}

export function sinkSignalMeta(state={}, {type, payload}) {
  switch (type) {
    case ADD_SINK_SIGNAL:
      {
        state = {...state}
        state[payload.key] = payload
        return state
      }
    case ADD_MIDI_SINK_CC:
      {
        let [key, name] = midiOutStreamName(payload)
        state = {...state}
        state[key] = {name, owner: "MIDI"}
        return state
      }
    case ADD_GENERIC_SINK_SIGNAL:
      {
        let [key, name] = genericSinkSignalName(payload)
        state = {...state}
        state[key] = {name, owner: "Signal"}
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
        let [key, name] = midiOutStreamName(payload)
        state = {...state}
        delete state[key]
        return state
      }
    case REMOVE_GENERIC_SINK_SIGNAL:
      {
        let [key, name] = genericSinkSignalName(payload)
        state = {...state}
        delete state[key]
        return state
      }
    default:
      return state
  }
}

export function comboSignalMeta(state={}, {type, payload}) {
  switch (type) {
    case ADD_SOURCE_SIGNAL:
      {
        state = {...state}
        state[payload.key] = payload
        return state
      }
    case ADD_MIDI_SOURCE_CC:
      {
        let [key, name] = midiInStreamName(payload)
        state = {...state}
        state[key] = {name, owner: "MIDI"}
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
    case ADD_SINK_SIGNAL:
      {
        state = {...state}
        state[payload.key] = payload
        return state
      }
    case ADD_MIDI_SINK_CC:
      {
        let [key, name] = midiOutStreamName(payload)
        state = {...state}
        state[key] = {name, owner: "MIDI"}
        return state
      }
    case ADD_GENERIC_SINK_SIGNAL:
      {
        let [key, name] = genericSinkSignalName(payload)
        state = {...state}
        state[key] = {name, owner: "Signal"}
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
        let [key, name] = midiOutStreamName(payload)
        state = {...state}
        delete state[key]
        return state
      }
    case REMOVE_GENERIC_SINK_SIGNAL:
      {
        let [key, name] = genericSinkSignalName(payload)
        state = {...state}
        delete state[key]
        return state
      }
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
    case REMOVE_MIDI_SOURCE_CC:
      {
        let [key, name] = midiInStreamName(payload)
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
    case REMOVE_MIDI_SINK_CC:
      {
        let [key, name] = midiOutStreamName(payload)
        return sourceSinkScale(state, removeSinkSignal(key))
      }
    case REMOVE_GENERIC_SINK_SIGNAL:
      {
        let [key, name] = genericSinkSignalName(payload)
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
    case RANDOMIZE:
      {
        let sourceKeys = Object.keys(payload.signal.sourceSignalMeta).sort();
        let sinkKeys = Object.keys(payload.signal.sinkSignalMeta).sort();
        state = {}
        let i = 0;
        for (let sinkKey of sinkKeys){
          let sourceKey = sourceKeys[i];
          let mapkey = (sourceKey + '/' + sinkKey)
          state[mapkey] = 0.5;
          i = (i + 1) % (sourceKeys.length)
        }
        return state
      }
    default:
      return state
  }
}
export function nGenericSinkSignals(state=1, {type, payload}) {
  switch (type) {
    case SET_N_GENERIC_SINK_SIGNALS:
      return payload
    default:
      return state
  }
}

export function genericSinkSignals(state={}, {type, payload}) {
  let next, key, val;
  switch (type) {
    case ADD_GENERIC_SINK_SIGNAL:
      next = {...state};
      [key, val] = genericSinkSignalName(payload);
      next[key] = val
      return next
    case REMOVE_GENERIC_SINK_SIGNAL:
      next = {...state};
      [key, val] = genericSinkSignalName(payload);
      delete next[key]
      return next
    default:
      return state
  }
}

const partialReducer = combineReducers({
  sourceSignalMeta,
  sinkSignalMeta,
  comboSignalMeta,
  sourceSinkScale,
  nGenericSinkSignals,
  genericSinkSignals
})

export default function (state={}, action) {
  const result = partialReducer(state, action)
  return result
}
