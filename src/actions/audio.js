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
export const SET_ALL_AUDIO_SOURCE_DEVICES = 'SET_ALL_AUDIO_SOURCE_DEVICES'
export const SET_AUDIO_SOURCE_DEVICE = 'SET_AUDIO_SOURCE_DEVICE'
export const SET_VALID_AUDIO_SOURCE_DEVICE = 'SET_VALID_AUDIO_SOURCE_DEVICE'
export const SET_AUDIO_SOURCE_CHANNEL = 'SET_AUDIO_SOURCE_CHANNEL'
export const ADD_AUDIO_SOURCE_CC = 'ADD_AUDIO_SOURCE_CC'
export const REMOVE_AUDIO_SOURCE_CC = 'REMOVE_AUDIO_SOURCE_CC'

export const SET_ALL_AUDIO_SINK_DEVICES = 'SET_ALL_AUDIO_SINK_DEVICES'
export const SET_AUDIO_SINK_DEVICE = 'SET_AUDIO_SINK_DEVICE'
export const SET_VALID_AUDIO_SINK_DEVICE = 'SET_VALID_AUDIO_SINK_DEVICE'
export const SET_AUDIO_SINK_CHANNEL = 'SET_AUDIO_SINK_CHANNEL'
export const ADD_AUDIO_SINK_CC = 'ADD_AUDIO_SINK_CC'
export const REMOVE_AUDIO_SINK_CC = 'REMOVE_AUDIO_SINK_CC'
export const TOGGLE_SOLO_AUDIO_SINK_CC = 'TOGGLE_SOLO_AUDIO_SINK_CC'

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
export function addAudioSourceCC(cc) {
  return { type: ADD_AUDIO_SOURCE_CC, payload: cc }
}
export function removeAudioSourceCC(x) {
  return { type: REMOVE_AUDIO_SOURCE_CC, payload: x }
}

export function addUnknownAudioSourceCC() {
  return (dispatch, getState) => {
    const ccset = getState().midi.sourceCCs;
    let newCC = nextCC(ccset)
    if (newCC >= 0) {
      dispatch(addAudioSourceCC(newCC));
    }
  };
}

export function addUnknownAudioSinkCC() {
  return (dispatch, getState) => {
    const ccset = getState().midi.sinkCCs;
    let newCC = nextCC(ccset)
    if (newCC >= 0) {
      dispatch(addAudioSinkCC(newCC));
    }
  };
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
export function addAudioSinkCC(x) {
 return { type: ADD_AUDIO_SINK_CC, payload: x }
}
export function removeAudioSinkCC(x) {
 return { type: REMOVE_AUDIO_SINK_CC, payload: x }
}
export function soloAudioSinkCC(x) {
 return { type: TOGGLE_SOLO_AUDIO_SINK_CC, payload: x }
}
