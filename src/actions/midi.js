/*
 * action types
 */

export const SET_ALL_MIDI_SOURCES = 'SET_ALL_MIDI_SOURCES'
export const SET_CURRENT_MIDI_SOURCE = 'SET_CURRENT_MIDI_SOURCE'
export const SET_VALID_MIDI_SOURCE = 'SET_VALID_MIDI_SOURCE'

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
