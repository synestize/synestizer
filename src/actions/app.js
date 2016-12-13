export const LOAD = 'LOAD'
export const RESET_TO_NOTHING = 'RESET_TO_NOTHING'
export const RANDOMIZE = 'RANDOMIZE'

export const resetToNothing = () => {
  return { type: RESET_TO_NOTHING, payload: undefined }
}
export const randomize = () => {
  // Thunk middleware to allow adaptive reset
  return function(dispatch, getState) {
    // We need to know what signals are available
    // to know what the defaults should be
    let state = getState()
    return dispatch({
      type: RANDOMIZE,
      payload: {
        signal: state.signal,
        audio: state.audio,
      }
    })
  }
}
export const load = (serialized) => {
  return { type: LOAD, payload: serialized }
}
export const loadFromUrl = (url, refresh=true) => {
  // dispatch URL loader here
  return (dispatch) => {
    return fetch(url).then(
      resp => {
        if (resp.ok) {
          resp.text().then(
            serialized => {
              dispatch(
                load(serialized)
              )
              console.debug('refreshin you', refresh)
              if (refresh) {
                // update address without reloading, or the state may not
                // get serialized fast enough.
                history.replaceState(
                  'home',
                  '',
                  window.location.origin +
                    window.location.pathname +
                    window.location.hash
                  );
              }
            }
          )
        } else {
          console.error('network request failed', resp);
        }
      },
      error => console.error(error)
    );
  };
}
