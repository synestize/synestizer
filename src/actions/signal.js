/*
 * action types
 */

export const ADD_SOURCE_SIGNAL = 'ADD_SOURCE_SIGNAL'
export const REMOVE_SOURCE_SIGNAL = 'REMOVE_SOURCE_SIGNAL'
export const SET_SOURCE_SIGNAL_VALUE = 'SET_SOURCE_SIGNAL_VALUE'
export const SET_ALL_SOURCE_SIGNAL_VALUES = 'SET_ALL_SOURCE_SIGNAL_VALUES'
export const ADD_SINK_SIGNAL = 'ADD_SINK_SIGNAL'
export const REMOVE_SINK_SIGNAL = 'REMOVE_SINK_SIGNAL'
export const SET_SINK_SIGNAL_VALUE = 'SET_SINK_SIGNAL_VALUE'
export const SET_ALL_SINK_SIGNAL_VALUES = 'SET_ALL_SINK_SIGNAL_VALUES'
export const SET_SOURCE_SINK_SCALE = 'SET_SOURCE_SINK_SCALE'
export const SET_SINK_BIAS = 'SET_SINK_BIAS'
export const ADD_GENERIC_SINK_SIGNAL = 'ADD_GENERIC_SINK_SIGNAL'
export const REMOVE_GENERIC_SINK_SIGNAL = 'REMOVE_GENERIC_SINK_SIGNAL'
export const SET_N_GENERIC_SINK_SIGNALS = 'SET_N_GENERIC_SINK_SIGNALS'

/*
 * action creators
 */
export function addSourceSignal(meta) {
  return { type: ADD_SOURCE_SIGNAL, payload: meta }
}
export function removeSourceSignal(key) {
  return { type: REMOVE_SOURCE_SIGNAL, payload: key }
}
export function setSourceSignalValue(key, value) {
  return { type: SET_SOURCE_SIGNAL_VALUE, payload: [key, value] }
}
export function setAllSourceSignalValues(dict) {
  return { type: SET_ALL_SOURCE_SIGNAL_VALUES, payload: dict }
}
export function addSinkSignal(meta) {
  return { type: ADD_SINK_SIGNAL, payload: meta }
}
export function removeSinkSignal(key) {
  return { type: REMOVE_SINK_SIGNAL, payload: key }
}
export function setSinkSignalValue(key, val) {
  return { type: SET_SINK_SIGNAL_VALUE, payload: [key, val] }
}
export function setAllSinkSignalValues(dict) {
  return { type: SET_ALL_SINK_SIGNAL_VALUES, payload: dict }
}
export function setSourceSinkScale(sourceKey, sinkKey, value) {
  return { type: SET_SOURCE_SINK_SCALE, payload: [sourceKey, sinkKey, value] }
}
export function setSinkBias(key, val) {
  return { type: SET_SINK_BIAS, payload: [key, val] }
}
export function addGenericSinkSignal(key) {
 return { type: ADD_GENERIC_SINK_SIGNAL, payload: key }
}
export function removeGenericSinkSignal(key) {
 return { type: REMOVE_GENERIC_SINK_SIGNAL, payload: key }
}
export function setMaxNGenericSinkSignals(i) {
  return {type: SET_N_GENERIC_SINK_SIGNALS, payload: i }
}
