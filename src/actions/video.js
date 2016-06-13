/*
 * action types
 */

export const SET_ALL_VIDEO_SOURCES = 'SET_ALL_VIDEO_SOURCES'
export const SET_CURRENT_VIDEO_SOURCE = 'SET_CURRENT_VIDEO_SOURCE'
export const SET_VALID_VIDEO_SOURCE = 'SET_VALID_VIDEO_SOURCE'

/*
 * action creators
 */
export function setAllVideoSources(sourceDict) {
  return { type: SET_ALL_VIDEO_SOURCES, payload: sourceDict }
}
export function setCurrentVideoSource(sourceId) {
  return { type: SET_CURRENT_VIDEO_SOURCE, payload: sourceId }
}
export function setValidVideoSource(yn) {
  return { type: SET_VALID_VIDEO_SOURCE, payload: yn }
}
