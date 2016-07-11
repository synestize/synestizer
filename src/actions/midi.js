/*
 * action types
 */

export const SET_ALL_MIDI_SOURCE_DEVICES = 'SET_ALL_MIDI_SOURCE_DEVICES'
export const SET_MIDI_SOURCE_DEVICE = 'SET_MIDI_SOURCE_DEVICE'
export const SET_VALID_MIDI_SOURCE_DEVICE = 'SET_VALID_MIDI_SOURCE_DEVICE'
export const SET_MIDI_SOURCE_CHANNEL = 'SET_MIDI_SOURCE_CHANNEL'
export const ADD_MIDI_SOURCE_CC = 'ADD_MIDI_SOURCE_CC'
export const REMOVE_MIDI_SOURCE_CC = 'REMOVE_MIDI_SOURCE_CC'
export const SET_MIDI_SOURCE_CCS = 'SET_MIDI_SOURCE_CCS'
export const SWAP_MIDI_SOURCE_CC = 'SWAP_MIDI_SOURCE_CC'

export const SET_ALL_MIDI_SINK_DEVICES = 'SET_ALL_MIDI_SINK_DEVICES'
export const SET_MIDI_SINK_DEVICE = 'SET_MIDI_SINK_DEVICE'
export const SET_VALID_MIDI_SINK_DEVICE = 'SET_VALID_MIDI_SINK_DEVICE'
export const SET_MIDI_SINK_CHANNEL = 'SET_MIDI_SINK_CHANNEL'
export const ADD_MIDI_SINK_CC = 'ADD_MIDI_SINK_CC'
export const REMOVE_MIDI_SINK_CC = 'REMOVE_MIDI_SINK_CC'
export const SET_MIDI_SINK_CCS = 'SET_MIDI_SINK_CCS'
export const SWAP_MIDI_SINK_CC = 'SWAP_MIDI_SINK_CC'

/*
 * action creators
 */
export function setAllMidiSourceDevices(sourceDict) {
  return { type: SET_ALL_MIDI_SOURCE_DEVICES, payload: sourceDict }
}
export function setMidiSourceDevice(sourceId) {
  return { type: SET_MIDI_SOURCE_DEVICE, payload: sourceId }
}
export function setValidMidiSourceDevice(yn) {
  return { type: SET_VALID_MIDI_SOURCE_DEVICE, payload: yn }
}
export function setMidiSourceChannel(x) {
  return { type: SET_MIDI_SOURCE_CHANNEL, payload: x }
}
export function addMidiSourceCC(x) {
  return { type: ADD_MIDI_SOURCE_CC, payload: x }
}
export function removeMidiSourceCC(x) {
  return { type: REMOVE_MIDI_SOURCE_CC, payload: x }
}
export function setMidiSourceCCs(x) {
  return { type: SET_MIDI_SOURCE_CCS, payload: x }
}
export function swapMidiSourceCC(x,y) {
  return { type: SWAP_MIDI_SOURCE_CC, payload: [x,y] }
}


export function setAllMidiSinkDevices(sourceDict) {
 return { type: SET_ALL_MIDI_SINK_DEVICES, payload: sourceDict }
}
export function setMidiSinkDevice(sourceId) {
 return { type: SET_MIDI_SINK_DEVICE, payload: sourceId }
}
export function setValidMidiSinkDevice(yn) {
 return { type: SET_VALID_MIDI_SINK_DEVICE, payload: yn }
}
export function setMidiSinkChannel(x) {
 return { type: SET_MIDI_SINK_CHANNEL, payload: x }
}
export function addMidiSinkCC(x) {
 return { type: ADD_MIDI_SINK_CC, payload: x }
}
export function removeMidiSinkCC(x) {
 return { type: REMOVE_MIDI_SINK_CC, payload: x }
}
export function setMidiSinkCCs(x) {
 return { type: SET_MIDI_SINK_CCS, payload: x }
}
export function swapMidiSinkCC(x,y) {
 return { type: SWAP_MIDI_SINK_CC, payload: [x,y] }
}
