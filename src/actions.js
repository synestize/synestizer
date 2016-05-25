/*
 * action types
 */

export const SET_TAB = 'SET_TAB'

/*
 * action creators
 */

export function setTab(tab) {
  return { type: SET_TAB, tab }
}
