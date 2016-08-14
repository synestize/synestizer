import { addSourceSignal, removeSourceSignal, addSinkSignal, removeSinkSignal } from './signal'

/*
 * action types
 */
export const SET_ALL_AUDIO_SOURCE_DEVICES = 'SET_ALL_AUDIO_SOURCE_DEVICES'
export const SET_AUDIO_SOURCE_DEVICE = 'SET_AUDIO_SOURCE_DEVICE'
export const SET_VALID_AUDIO_SOURCE_DEVICE = 'SET_VALID_AUDIO_SOURCE_DEVICE'
export const SET_AUDIO_SOURCE_CHANNEL = 'SET_AUDIO_SOURCE_CHANNEL'
export const ADD_AUDIO_SOURCE_CONTROL = 'ADD_AUDIO_SOURCE_CONTROL'
export const REMOVE_AUDIO_SOURCE_CONTROL = 'REMOVE_AUDIO_SOURCE_CONTROL'

export const SET_ALL_AUDIO_SINK_DEVICES = 'SET_ALL_AUDIO_SINK_DEVICES'
export const SET_AUDIO_SINK_DEVICE = 'SET_AUDIO_SINK_DEVICE'
export const SET_VALID_AUDIO_SINK_DEVICE = 'SET_VALID_AUDIO_SINK_DEVICE'
export const SET_AUDIO_SINK_CHANNEL = 'SET_AUDIO_SINK_CHANNEL'
export const ADD_AUDIO_SINK_CONTROL = 'ADD_AUDIO_SINK_CONTROL'
export const REMOVE_AUDIO_SINK_CONTROL = 'REMOVE_AUDIO_SINK_CONTROL'

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
export function setAudioSourceChannel(x) {
  return { type: SET_AUDIO_SOURCE_CHANNEL, payload: x }
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
export function setAudioSinkChannel(x) {
 return { type: SET_AUDIO_SINK_CHANNEL, payload: x }
}
export function addAudioSinkControl(x) {
 return { type: ADD_AUDIO_SINK_CONTROL, payload: x }
}
export function removeAudioSinkControl(x) {
 return { type: REMOVE_AUDIO_SINK_CONTROL, payload: x }
}
