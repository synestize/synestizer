'use strict';
import { combineReducers } from 'redux'
import { union, difference, intersection } from '../lib/fakesetop'
import {
  addSourceStream,
  removeSourceStream,
  addSinkStream,
  removeSinkStream,
  ADD_SOURCE_STREAM,
  REMOVE_SOURCE_STREAM,
  SET_SOURCE_STREAM_VALUE,
  SET_ALL_SOURCE_STREAM_VALUES,
  ADD_SINK_STREAM,
  REMOVE_SINK_STREAM,
  SET_SINK_STREAM_VALUE,
  SET_ALL_SINK_STREAM_VALUES,
  SET_SOURCE_SINK_SCALE,
  SET_SINK_BIAS,

} from '../actions/stream'


function stream_name_midi(cc) {
  return ['midi-cc-'+ cc, 'CC ' + cc]
}

import {
  ADD_MIDI_SOURCE_CC,
  REMOVE_MIDI_SOURCE_CC,
  ADD_MIDI_SINK_CC,
  REMOVE_MIDI_SINK_CC,
} from '../actions/midi'

export function sourceStreamMeta(state={}, {type, payload}) {
  switch (type) {
    case ADD_SOURCE_STREAM:
      {
        let [key, name] = payload;
        state = {...state}
        state[key] = name
        return state
      }
    case ADD_MIDI_SOURCE_CC:
      {
        let [key, name] = stream_name_midi(payload)
        state = {...state}
        state[key] = name
        return state
      }
    case REMOVE_SOURCE_STREAM:
      {
        let state = {...state}
        delete state[payload]
        return state
      }
    case REMOVE_MIDI_SOURCE_CC:
      {
        let [key, name] = stream_name_midi(payload)
        state = {...state}
        delete state[key]
        return state
      }
    default:
      return state
  }
}

export function sinkStreamMeta(state={}, {type, payload}) {
  switch (type) {
    case ADD_SINK_STREAM:
      {
        let [key, name] = payload;
        state = {...state}
        state[key] = name
        return state
      }
    case ADD_MIDI_SINK_CC:
      {
        let [key, name] = stream_name_midi(payload)
        state = {...state}
        state[key] = name
        return state
      }
    case REMOVE_SINK_STREAM:
      {
        let state = {...state}
        delete state[payload]
        return state
      }
    case REMOVE_MIDI_SINK_CC:
      {
        let [key, name] = stream_name_midi(payload)
        state = {...state}
        delete state[key]
        return state
      }
    default:
      return state
  }
}

export function sourceStreamValues(state={}, {type, payload}) {
  switch (type) {
    case ADD_SOURCE_STREAM:
      {
        let [key, val] = payload;
        state = {...state}
        state[key] = 0.0
        return state
      }
    case ADD_MIDI_SOURCE_CC:
      {
        let [key, name] = stream_name_midi(payload)
        state = {...state}
        state[key] = 0.0
        return state
      }
    case REMOVE_SOURCE_STREAM:
      {
        let state = {...state}
        delete state[payload]
        return state
      }
    case REMOVE_MIDI_SOURCE_CC:
      {
        let [key, name] = stream_name_midi(payload)
        state = {...state}
        delete state[key]
        return state
      }
    case SET_SOURCE_STREAM_VALUE:
      {
        let [key, val] = payload;
        state = {...state}
        state[key] = val
        return state
      }
    case SET_ALL_SOURCE_STREAM_VALUES:
      return { ...state, ...payload };
    default:
      return state
  }
}

export function sinkStreamValues(state={}, {type, payload}) {
  switch (type) {
    case ADD_SOURCE_STREAM:
      {
        let [key, val] = payload;
        state = {...state}
        state[key] = 0.0
        return state
      }
    case ADD_MIDI_SOURCE_CC:
      {
        let [key, name] = stream_name_midi(payload)
        state = {...state}
        state[key] = 0.0
        return state
      }
    case REMOVE_SOURCE_STREAM:
      {
        let state = {...state}
        delete state[payload]
        return state
      }
    case REMOVE_MIDI_SOURCE_CC:
      {
        let [key, name] = stream_name_midi(payload)
        state = {...state}
        delete state[key]
        return state
      }
    case SET_SOURCE_STREAM_VALUE:
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

export function sourceSinkScale(state={}, {type, payload}) {
  switch (type) {
    case SET_SOURCE_SINK_SCALE:
    {
      let [sourceKey, sinkKey, scale] = payload
      state = {...state}
      state[(sourceKey + '/' + sinkKey)] = scale
      return state
    }
    case REMOVE_MIDI_SINK_CC:
    {
      let [key, name] = stream_name_midi(payload)
      return sourceSinkScale(state, removeSinkStream(key))
    }
    case REMOVE_SINK_STREAM:
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
        let [key, name] = stream_name_midi(payload)
        console.debug('rems', key, name)
        return sourceSinkScale(state, removeSourceStream(key))
      }
    case REMOVE_SOURCE_STREAM:
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
    case ADD_SINK_STREAM:
    {
      let [key, name] = payload;
      state = {...state}
      state[key] = 0.0
      return state
    }
    case REMOVE_SINK_STREAM:
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
   sourceStreamMeta,
   sourceStreamValues,
   sinkStreamMeta,
   sinkStreamValues,
   sourceSinkScale,
   sinkBias
})

export default stream
