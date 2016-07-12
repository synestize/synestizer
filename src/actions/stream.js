/*
 * action types
 */

export const ADD_SOURCE_STREAM = 'ADD_SOURCE_STREAM'
export const REMOVE_SOURCE_STREAM = 'REMOVE_SOURCE_STREAM'
export const SET_SOURCE_STREAM_VALUE = 'SET_SOURCE_STREAM_VALUE'
export const SET_ALL_SOURCE_STREAM_VALUES = 'SET_ALL_SOURCE_STREAM_VALUES'
export const ADD_SINK_STREAM = 'ADD_SINK_STREAM'
export const REMOVE_SINK_STREAM = 'REMOVE_SINK_STREAM'
export const SET_SINK_STREAM_VALUE = 'SET_SINK_STREAM_VALUE'
export const SET_ALL_SINK_STREAM_VALUES = 'SET_ALL_SINK_STREAM_VALUES'
export const SET_SOURCE_SINK_SCALE = 'SET_SOURCE_SINK_SCALE'
export const SET_SINK_BIAS = 'SET_SINK_BIAS'

/*
 * action creators
 */
export function addSourceStream(key, name) {
  return { type: ADD_SOURCE_STREAM, payload: [key, name] }
}
export function removeSourceStream(key) {
  return { type: REMOVE_SOURCE_STREAM, payload: key }
}
export function setSourceStreamValue(key, value) {
  return { type: SET_SOURCE_STREAM_VALUE, payload: [key, value] }
}
export function setAllSourceStreamValues(dict) {
  return { type: SET_ALL_SOURCE_STREAM_VALUE, payload: dict }
}
export function addSinkStream(key, name) {
  return { type: ADD_SINK_STREAM, payload: [key, name] }
}
export function removeSinkStream(key) {
  return { type: REMOVE_SINK_STREAM, payload: key }
}
export function setSinkStreamValue(key, val) {
  return { type: SET_SINK_STREAM_VALUE, payload: [key, val] }
}
export function setAllSinkStreamValue(dict) {
  return { type: SET_ALL_SINK_STREAM_VALUES, payload: dict }
}
export function setSourceSinkScale(sourceKey, sinkKey, value) {
  return { type: SET_SOURCE_SINK_SCALE, payload: [sourceKey, sinkKey, value] }
}
export function setSinkBias(key, val) {
  return { type: SET_SINK_BIAS, payload: [key, val] }
}
