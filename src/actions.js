/*
 * action types
 */

export const SET_VISIBLE_PANE = 'SET_VISIBLE_PANE'

/*
 * action creators
 */

export function setPane(tab) {
  return { type: SET_VISIBLE_PANE, payload: tab }
}
