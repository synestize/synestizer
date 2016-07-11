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
export function addSourceStream(sourceDict) {
  return { type: SET_ALL_MIDI_SOURCE_DEVICES, payload: sourceDict }
}
export function removeSourceStream(sourceId) {
  return { type: SET_MIDI_SOURCE_DEVICE, payload: sourceId }
}
export function setSourceStreamValue(yn) {
  return { type: SET_VALID_MIDI_SOURCE_DEVICE, payload: yn }
}
export function addSinkStream(x) {
  return { type: SET_MIDI_SOURCE_CHANNEL, payload: x }
}
export function removeSinkStream(x) {
  return { type: ADD_MIDI_SOURCE_CC, payload: x }
}
export function setSourceSinkScale(x) {
  return { type: REMOVE_MIDI_SOURCE_CC, payload: x }
}
export function setSinkBias(x) {
  return { type: SET_MIDI_SOURCE_CCS, payload: x }
}
