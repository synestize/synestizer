 export const SET_VISIBLE_PANE = 'SET_VISIBLE_PANE'
 export const RESET_TO_NOTHING = 'RESET_TO_NOTHING'
 export const RESET_TO_DEFAULT = 'RESET_TO_DEFAULT'

export const setVisiblePane = (tab) => {
  return { type: SET_VISIBLE_PANE, payload: tab }
}
export const resetToNothing = () => {
  return { type: RESET_TO_NOTHING, payload: undefined }
}
export const resetToDefault = () => {
  // Thunk middleware to allow adaptive reset
  return function(dispatch, getState) {
    // We need to know what signals are available
    // to know what the defaults should be
    let state = getState()
    return dispatch({
      type: RESET_TO_DEFAULT,
      payload: {
        signal: state.signal,
        audio: state.audio
      }
    })
  }
}
