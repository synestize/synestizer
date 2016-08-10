import { addSourceSignal, removeSourceSignal, addSinkSignal, removeSinkSignal } from './signal'

function nextCC(ccset) {
  for (let i= Math.max(-1, ...ccset)+1;i<128; i++) {
    let j = i % 128;
    if (ccset.indexOf(j)<0) {
      return j
    }
  }
  return -1
}

/*
 * action types
 */
export const SET_ALL_MIDI_SOURCE_DEVICES = 'SET_ALL_MIDI_SOURCE_DEVICES'
export const SET_MIDI_SOURCE_DEVICE = 'SET_MIDI_SOURCE_DEVICE'
export const SET_VALID_MIDI_SOURCE_DEVICE = 'SET_VALID_MIDI_SOURCE_DEVICE'
export const SET_MIDI_SOURCE_CHANNEL = 'SET_MIDI_SOURCE_CHANNEL'
export const ADD_MIDI_SOURCE_CC = 'ADD_MIDI_SOURCE_CC'
export const REMOVE_MIDI_SOURCE_CC = 'REMOVE_MIDI_SOURCE_CC'

export const SET_ALL_MIDI_SINK_DEVICES = 'SET_ALL_MIDI_SINK_DEVICES'
export const SET_MIDI_SINK_DEVICE = 'SET_MIDI_SINK_DEVICE'
export const SET_VALID_MIDI_SINK_DEVICE = 'SET_VALID_MIDI_SINK_DEVICE'
export const SET_MIDI_SINK_CHANNEL = 'SET_MIDI_SINK_CHANNEL'
export const ADD_MIDI_SINK_CC = 'ADD_MIDI_SINK_CC'
export const REMOVE_MIDI_SINK_CC = 'REMOVE_MIDI_SINK_CC'
export const TOGGLE_SOLO_MIDI_SINK_CC = 'TOGGLE_SOLO_MIDI_SINK_CC'

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
export function addMidiSourceCC(cc) {
  return { type: ADD_MIDI_SOURCE_CC, payload: cc }
}
export function removeMidiSourceCC(x) {
  return { type: REMOVE_MIDI_SOURCE_CC, payload: x }
}

export function addUnknownMidiSourceCC() {
  return (dispatch, getState) => {
    const ccset = getState().midi.sourceCCs;
    let newCC = nextCC(ccset)
    if (newCC >= 0) {
      dispatch(addMidiSourceCC(newCC));
    }
  };
}

export function addUnknownMidiSinkCC() {
  return (dispatch, getState) => {
    const ccset = getState().midi.sinkCCs;
    let newCC = nextCC(ccset)
    if (newCC >= 0) {
      dispatch(addMidiSinkCC(newCC));
    }
  };
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
export function soloMidiSinkCC(x) {
 return { type: TOGGLE_SOLO_MIDI_SINK_CC, payload: x }
}
