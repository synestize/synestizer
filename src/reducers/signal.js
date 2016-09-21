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
  PUBLISH_GENERIC_SINK_SIGNAL,
  UNPUBLISH_GENERIC_SINK_SIGNAL,
  SET_N_GENERIC_SINK_SIGNALS,
} from '../actions/signal'
import { midiStreamName } from '../io/midi/util'
import {
  ADD_MIDI_SOURCE_CC,
  REMOVE_MIDI_SOURCE_CC,
  ADD_MIDI_SINK_CC,
  REMOVE_MIDI_SINK_CC,
} from '../actions/midi'
import { genericSignalName } from '../io/signal/util'


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
        let [key, name] = midiStreamName(payload)
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
        state = {...state}
        state[payload.key] = payload
        return state
      }
    case ADD_MIDI_SINK_CC:
      {
        let [key, name] = midiStreamName(payload)
        state = {...state}
        state[key] = {name, owner: "MIDI"}
        return state
      }
    case PUBLISH_GENERIC_SINK_SIGNAL:
      {
        let [key, name] = genericSignalName(payload)
        state = {...state}
        state[key] = {name, owner: "Audio"}
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
    case UNPUBLISH_GENERIC_SINK_SIGNAL:
      {
        let [key, name] = genericSignalName(payload)
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
    case REMOVE_MIDI_SINK_CC:
      {
        let [key, name] = midiStreamName(payload)
        return sourceSinkScale(state, removeSinkSignal(key))
      }
    case UNPUBLISH_GENERIC_SINK_SIGNAL:
      {
        let [key, name] = genericSignalName(payload)
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
    default:
      return state
  }
}
export function nGenericSinkSignals(state=6, {type, payload}) {
  switch (type) {
    case SET_N_GENERIC_SINK_SIGNALS:
      console.debug("sognal", state, type, payload);
      return payload
    default:
      return state
  }
}

export function genericSignals(state={}, {type, payload}) {
  let next, key, val;
  switch (type) {
    case PUBLISH_GENERIC_SINK_SIGNAL:
      next = {...state};
      [key, val] = genericSignalName(payload);
      next[key] = val
      return next
    case UNPUBLISH_GENERIC_SINK_SIGNAL:
      next = {...state};
      [key, val] = genericSignalName(payload);
      delete next[key]
      return next
    default:
      return state
  }
}

const stream = combineReducers({
   sourceSignalMeta,
   sinkSignalMeta,
   sourceSinkScale,
   nGenericSinkSignals,
   genericSignals
})

export default stream
