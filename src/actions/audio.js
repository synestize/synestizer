import { addSourceSignal, removeSourceSignal, addSinkSignal, removeSinkSignal } from './signal'

/*
 * action types
 */
export const SET_ALL_AUDIO_SOURCE_DEVICES = 'SET_ALL_AUDIO_SOURCE_DEVICES'
export const SET_AUDIO_SOURCE_DEVICE = 'SET_AUDIO_SOURCE_DEVICE'
export const SET_VALID_AUDIO_SOURCE_DEVICE = 'SET_VALID_AUDIO_SOURCE_DEVICE'
export const PUBLISH_AUDIO_SOURCE_CONTROL = 'PUBLISH_AUDIO_SOURCE_CONTROL'
export const UNPUBLISH_AUDIO_SOURCE_CONTROL = 'UNPUBLISH_AUDIO_SOURCE_CONTROL'
export const SET_AUDIO_SOURCE_CONTROL_NOMINAL_VALUE = 'SET_AUDIO_SOURCE_CONTROL_NOMINAL_VALUE'

export const SET_ALL_AUDIO_SINK_DEVICES = 'SET_ALL_AUDIO_SINK_DEVICES'
export const SET_AUDIO_SINK_DEVICE = 'SET_AUDIO_SINK_DEVICE'
export const SET_VALID_AUDIO_SINK_DEVICE = 'SET_VALID_AUDIO_SINK_DEVICE'
export const ADD_AUDIO_SINK_CONTROL = 'ADD_AUDIO_SINK_CONTROL'
export const REMOVE_AUDIO_SINK_CONTROL = 'REMOVE_AUDIO_SINK_CONTROL'
export const PUBLISH_AUDIO_SINK_CONTROL = 'PUBLISH_AUDIO_SINK_CONTROL'
export const UNPUBLISH_AUDIO_SINK_CONTROL = 'UNPUBLISH_AUDIO_SINK_CONTROL'
export const SET_AUDIO_SINK_CONTROL_NOMINAL_VALUE = 'SET_AUDIO_SINK_CONTROL_NOMINAL_VALUE'
export const ADD_ENSEMBLE = 'ADD_ENSEMBLE'
/*
 * action creators
 */
export function setAllAudioSourceDevices(sourceDict) {
  return { type: SET_ALL_AUDIO_SOURCE_DEVICES, payload: sourceDict }
}
export function setAudioSourceDevice(sourceId) {
  return { type: SET_AUDIO_SOURCE_DEVICE, payload: sourceId }
}
export function setValidAudioSourceDevice(yn) {
  return { type: SET_VALID_AUDIO_SOURCE_DEVICE, payload: yn }
}
export function setAllAudioSinkDevices(sourceDict) {
 return { type: SET_ALL_AUDIO_SINK_DEVICES, payload: sourceDict }
}
export function setAudioSinkDevice(sourceId) {
 return { type: SET_AUDIO_SINK_DEVICE, payload: sourceId }
}
export function setValidAudioSinkDevice(yn) {
 return { type: SET_VALID_AUDIO_SINK_DEVICE, payload: yn }
}
export function publishAudioSourceControl(key) {
 return { type: PUBLISH_AUDIO_SOURCE_CONTROL, payload: key }
}
export function unpublishAudioSourceControl(key) {
 return { type: UNPUBLISH_AUDIO_SOURCE_CONTROL, payload: key }
}
export function setAudioSourceControlNominalValue(key, val) {
 return { type: SET_AUDIO_SOURCE_CONTROL_NOMINAL_VALUE, payload: {key, val}}
}
export function addAudioSinkControl(meta) {
 return { type: ADD_AUDIO_SINK_CONTROL, payload: meta }
}
export function removeAudioSinkControl(key) {
 return { type: REMOVE_AUDIO_SINK_CONTROL, payload: key }
}
export function publishAudioSinkControl(key) {
 return { type: PUBLISH_AUDIO_SINK_CONTROL, payload: key }
}
export function unpublishAudioSinkControl(key) {
 return { type: UNPUBLISH_AUDIO_SINK_CONTROL, payload: key }
}
export function setAudioSinkControlNominalValue(key, val) {
 return { type: SET_AUDIO_SINK_CONTROL_NOMINAL_VALUE, payload: {key, val}}
}
export function addEnsemble(meta) {
  return { type: ADD_ENSEMBLE, payload: meta }
}
