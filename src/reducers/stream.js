'use strict';
import { combineReducers } from 'redux'
import { union, difference, intersection } from '../lib/fakesetop'

import {
  ADD_SOURCE_STREAM,
  REMOVE_SOURCE_STREAM,
  SET_SOURCE_STREAM_VALUE,
  SET_ALL_SOURCE_STREAM_VALUES,
  ADD_SINK_STREAM,
  REMOVE_SINK_STREAM,
  SET_SINK_STREAM_VALUE,
  SET_ALL_SINK_STREAM_VALUES,
  SET_SOURCE_SINK_SCALE,
  SET_SINK_BIAS
} from '../actions/stream'

export function sourceStreamMeta(state={}, {type, payload}) {
  switch (type) {
    case ADD_SOURCE_STREAM:
      return payload
    case REMOVE_SOURCE_STREAM:
      return payload
    default:
      return state
  }
}

export function sinkStreamMeta(state={}, {type, payload}) {
  switch (type) {
    case ADD_SINK_STREAM:
      return payload
    case REMOVE_SINK_STREAM:
      return payload
    default:
      return state
  }
}

export function sourceStreamValues(state={}, {type, payload}) {
  switch (type) {
    case ADD_SOURCE_STREAM:
      return payload
    case REMOVE_SOURCE_STREAM:
      return payload
    default:
      return state
  }
}

export function sinkStreamValues(state={}, {type, payload}) {
  switch (type) {
    case ADD_SINK_STREAM:
      return payload
    case REMOVE_SINK_STREAM:
      return payload
    default:
      return state
  }
}

export function streamPatch(state={}, {type, payload}) {
  switch (type) {
    case SET_SOURCE_SINK_SCALE:
      return payload
    case SET_SINK_BIAS:
      return payload
    default:
      return state
  }
}

const stream = combineReducers({
   sourceStreamMeta,
   sourceStreamValues,
   sinkStreamMeta,
   sinkStreamValues,
   streamPatch,
})

export default stream
