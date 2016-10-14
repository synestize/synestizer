/*
 * action types
 */
export const SET_ALL_AUDIO_SOURCE_DEVICES = 'SET_ALL_AUDIO_SOURCE_DEVICES'
export const SET_AUDIO_SOURCE_DEVICE = 'SET_AUDIO_SOURCE_DEVICE'
export const SET_VALID_AUDIO_SOURCE_DEVICE = 'SET_VALID_AUDIO_SOURCE_DEVICE'
export const PUBLISH_AUDIO_SOURCE_SIGNAL = 'PUBLISH_AUDIO_SOURCE_SIGNAL'
export const UNPUBLISH_AUDIO_SOURCE_SIGNAL = 'UNPUBLISH_AUDIO_SOURCE_SIGNAL'
export const SET_ALL_AUDIO_SINK_DEVICES = 'SET_ALL_AUDIO_SINK_DEVICES'
export const SET_AUDIO_SINK_DEVICE = 'SET_AUDIO_SINK_DEVICE'
export const SET_VALID_AUDIO_SINK_DEVICE = 'SET_VALID_AUDIO_SINK_DEVICE'
export const SET_AUDIO_READY = 'SET_AUDIO_READY'
export const ADD_AUDIO_SINK_CONTROL = 'ADD_AUDIO_SINK_CONTROL'
export const REMOVE_AUDIO_SINK_CONTROL = 'REMOVE_AUDIO_SINK_CONTROL'
export const SET_AUDIO_SINK_CONTROL_BIAS = 'SET_AUDIO_SINK_CONTROL_BIAS'
export const SET_AUDIO_SINK_CONTROL_SCALE = 'SET_AUDIO_SINK_CONTROL_SCALE'
export const SET_AUDIO_SINK_CONTROL_SIGNAL = 'SET_AUDIO_SINK_CONTROL_SIGNAL'
export const SET_AUDIO_SINK_CONTROL_ACTUAL_VALUE = 'SET_AUDIO_SINK_CONTROL_ACTUAL_VALUE'
export const SET_ALL_AUDIO_SINK_CONTROL_ACTUAL_VALUES = 'SET_ALL_AUDIO_SINK_CONTROL_ACTUAL_VALUES'
export const SET_MASTER_TEMPO = 'SET_MASTER_TEMPO'
export const SET_MASTER_GAIN = 'SET_MASTER_GAIN'
export const SET_MASTER_MUTE = 'SET_MASTER_MUTE'
export const TOGGLE_MASTER_MUTE = 'TOGGLE_MASTER_MUTE'

export const TOGGLE_BUBBLE_CHAMBER_VOICE_1_MUTE = 'TOGGLE_BUBBLE_CHAMBER_VOICE_1_MUTE'
export const TOGGLE_BUBBLE_CHAMBER_VOICE_2_MUTE = 'TOGGLE_BUBBLE_CHAMBER_VOICE_2_MUTE'
export const TOGGLE_BUBBLE_CHAMBER_VOICE_3_MUTE = 'TOGGLE_BUBBLE_CHAMBER_VOICE_3_MUTE'
export const TOGGLE_BUBBLE_CHAMBER_VOICE_4_MUTE = 'TOGGLE_BUBBLE_CHAMBER_VOICE_4_MUTE'


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
export function setAudioReady(yn) {
 return { type: SET_AUDIO_READY, payload: yn }
}
export function publishAudioSourceSignal(key) {
 return { type: PUBLISH_AUDIO_SOURCE_SIGNAL, payload: key }
}
export function unpublishAudioSourceSignal(key) {
 return { type: UNPUBLISH_AUDIO_SOURCE_SIGNAL, payload: key }
}
export function addAudioSinkControl(meta) {
 return { type: ADD_AUDIO_SINK_CONTROL, payload: meta }
}
export function removeAudioSinkControl(key) {
 return { type: REMOVE_AUDIO_SINK_CONTROL, payload: key }
}
export function setAudioSinkControlBias(key, val) {
 return { type: SET_AUDIO_SINK_CONTROL_BIAS, payload: {key, val}}
}
export function setAudioSinkControlScale(key, val) {
 return { type: SET_AUDIO_SINK_CONTROL_SCALE, payload: {key, val}}
}
export function setAudioSinkControlSignal(key, val) {
 return { type: SET_AUDIO_SINK_CONTROL_SIGNAL, payload: {key, val}}
}
export function setAudioSinkControlActualValue(key, val) {
 return { type: SET_AUDIO_SINK_CONTROL_ACTUAL_VALUE, payload: {key, val}}
}
export function setAllAudioSinkControlActualValues(vals) {
  return { type: SET_ALL_AUDIO_SINK_CONTROL_ACTUAL_VALUES, payload: vals}
}
export function setMasterTempo(bpm) {
  return { type: SET_MASTER_TEMPO, payload: bpm}
}
export function setMasterGain(db) {
  return { type: SET_MASTER_GAIN, payload: db}
}
export function setMasterMute(val) {
  return { type: SET_MASTER_MUTE, payload: val}
}
export function toggleMasterMute() {
  return { type: TOGGLE_MASTER_MUTE, payload: null}
}
export function toggleBubbleChamberVoice1Mute() {
  return { type: TOGGLE_BUBBLE_CHAMBER_VOICE_1_MUTE, payload: null}
}
export function toggleBubbleChamberVoice2Mute() {
  return { type: TOGGLE_BUBBLE_CHAMBER_VOICE_2_MUTE, payload: null}
}
export function toggleBubbleChamberVoice3Mute() {
  return { type: TOGGLE_BUBBLE_CHAMBER_VOICE_3_MUTE, payload: null}
}
export function toggleBubbleChamberVoice4Mute() {
  return { type: TOGGLE_BUBBLE_CHAMBER_VOICE_4_MUTE, payload: null}
}
