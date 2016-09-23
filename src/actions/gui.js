 export const SET_VISIBLE_PANE = 'SET_VISIBLE_PANE'
 export const RESET = 'RESET'

export const setVisiblePane = (tab) => {
  return { type: SET_VISIBLE_PANE, payload: tab }
}
export const reset = () => {
  return { type: RESET, payload: undefined }
}
