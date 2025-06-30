
// Serviceworker and Perf removed for modern build


// Main entry point everything
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { resetToNothing, loadFromUrl } from './actions/app'
import { RESET_TO_NOTHING, LOAD } from './actions/app'
import guiReducer from './features/gui/guiSlice'
import video from './reducers/video'
import midi from './reducers/midi'
import __volatile from './reducers/__volatile'
import signal from './reducers/signal'
import audio from './reducers/audio'
import App from './containers/App'
import videoio_ from 'io/video'
import midiio_ from 'io/midi'
import audioio_ from 'io/audio'
import signalio_ from 'io/signal'
import {
  getStoredState,
  autoRehydrate,
  createPersistor,
  persistStore,
  createTransform
} from 'redux-persist'

/*
 Localforage imports weirdly:
 https://github.com/localForage/localForage/issues/577
 */
import localForage from "localforage"

import { getq, arrayAsSet, setAsArray, objAsMap, mapAsObj } from 'lib/browser'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

// ServiceWorker and Perf removed for modern build
/*
We divide Synestizer into two part:

1. "App": React+Redux; the UI which interfaces with React DOM to manage state at the request of the user
2. "IO": Rx.js+browser DOM; the interfaces to browser services such as MIDI, Video, microphones and so on.

From the perspective of the App, IO may as well be running on a remote server.
although of course it is (for the moment) completely local.
IO can get to the app via the store, and updates its state from the store using Rx.

IO needs to put volatile state in the app, although I'm trying to minimize that.
I will name that state with a double underscore prefix
{
  __videoobject: CONFUSINGID,
}
*/
const persistConf = {
  blacklist: ['__volatile'],
  transforms: [],
  debounce: 10,
  storage: localForage
}

const loggerMiddleware = createLogger()

// Create root reducer that combines modern GUI slice with legacy reducers
const createRootReducer = () => {
  const modernReducer = combineReducers({
    video,
    midi,
    audio, 
    signal,
    gui: guiReducer,
    __volatile
  });
  
  // Wrapper to handle RESET_TO_NOTHING and LOAD actions
  return (state = {}, action) => {
    switch (action.type) {
      case RESET_TO_NOTHING:
        return modernReducer(undefined, action);
      case LOAD:
        let updates = JSON.parse(action.payload) || {};
        let newState = {...state, ...updates};
        return newState;
      default:
        return modernReducer(state, action);
    }
  };
};

let store;
let persistor;

let appRoot;
let videoio;
let midiio;
let signalio;
let audioio;
let enhancers;

if (!PRODUCTION) {
// if (false) {
  enhancers = applyMiddleware(
    thunkMiddleware//, // lets us dispatch() functions
    //loggerMiddleware // logs actions
  )
} else {
  enhancers = applyMiddleware(
    thunkMiddleware // lets us dispatch() functions
  )
}
getStoredState(persistConf, (err, restoredState) => {
  //For development we support purging all data
  let purge = getq("purge");
  let load = getq("load");
  if (purge) {
    restoredState = undefined;
  }
  store = configureStore({
    reducer: createRootReducer(),
    preloadedState: restoredState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunkMiddleware),
  })

  persistor = createPersistor(store, persistConf)
  if (purge) {
    persistor.purgeAll();
    console.warn("purging all local data", store.getState());
  }
  signalio = signalio_(store);
  videoio = videoio_(store, signalio, document.getElementById('video-io'));
  midiio = midiio_(store, signalio);
  audioio = audioio_(store, signalio, midiio);
  if (load) {
    console.warn("loading preset", load);
    store.dispatch(loadFromUrl(load))
  }
  if (
    (restoredState===undefined) ||
    (Object.keys(restoredState).length === 0) ||
    purge
  ) {
    store.dispatch(resetToNothing())
    store.dispatch(loadFromUrl('/presets/default.json'))
  }
  if (!PRODUCTION) {
    window.store = store;
    window.persistor = persistor;
  }
  // Mysteriously required for Settings Pane to work.
  window.React = React;
  const container = document.getElementById('synapp');
  const root = createRoot(container);
  appRoot = root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
})
