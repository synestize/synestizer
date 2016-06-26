/*
 * action types
 */

export const SET_ALL_MIDI_SOURCES = 'SET_ALL_MIDI_SOURCES'
export const SET_CURRENT_MIDI_SOURCE = 'SET_CURRENT_MIDI_SOURCE'
export const SET_VALID_MIDI_SOURCE = 'SET_VALID_MIDI_SOURCE'
export const SET_MIDI_SOURCE_CHANNEL = 'SET_MIDI_SOURCE_CHANNEL'
export const ADD_MIDI_SOURCE_CC = 'ADD_MIDI_SOURCE_CC'
export const REMOVE_MIDI_SOURCE_CC = 'REMOVE_MIDI_SOURCE_CC'
export const SET_MIDI_SOURCE_CC = 'SET_MIDI_SOURCE_CC'

/*
 * action creators
 */
export function setAllMidiSources(sourceDict) {
  return { type: SET_ALL_MIDI_SOURCES, payload: sourceDict }
}
export function setCurrentMidiSource(sourceId) {
  return { type: SET_CURRENT_MIDI_SOURCE, payload: sourceId }
}
export function setValidMidiSource(yn) {
  return { type: SET_VALID_MIDI_SOURCE, payload: yn }
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
export function setMidiSourceCC(x) {
  return { type: SET_MIDI_SOURCE_CC, payload: x }
}
