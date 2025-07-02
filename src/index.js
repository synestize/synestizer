
// Serviceworker and Perf removed for modern build

// Load process polyfill first for legacy redux-persist
import './polyfills/process.js';

// Main entry point everything
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { resetToNothing, loadFromUrl } from './actions/app'
import { RESET_TO_NOTHING, LOAD } from './actions/app'
import guiReducer from './features/gui/guiSlice'
import videoReducer from './features/video/videoSlice'
import midiReducer from './features/midi/midiSlice'
import audioReducer from './features/audio/audioSlice'
import signalReducer from './features/signal/signalSlice'
import __volatile from './reducers/__volatile'
import App from './containers/App'
import ErrorBoundary from './components/ErrorBoundary'
import videoio_ from 'io/video'
import midiio_ from 'io/midi'
import audioio_ from 'io/audio'
import signalio_ from 'io/signal'
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { PersistGate } from 'redux-persist/integration/react';

/*
 Localforage imports weirdly:
 https://github.com/localForage/localForage/issues/577
 */
import localForage from "localforage"

import { getq, arrayAsSet, setAsArray, objAsMap, mapAsObj } from 'lib/browser'
import thunkMiddleware from 'redux-thunk'
// import * as reduxLogger from 'redux-logger' // Disabled for now due to version compatibility

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
const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['__volatile']
}

// const loggerMiddleware = reduxLogger.createLogger ? reduxLogger.createLogger() : reduxLogger
const loggerMiddleware = null // Disabled for now

// Create root reducer that combines modern GUI slice with legacy reducers
const createRootReducer = () => {
  const modernReducer = combineReducers({
    video: videoReducer,
    midi: midiReducer,
    audio: audioReducer, 
    signal: signalReducer,
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

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, createRootReducer());

let appRoot;
let videoio;
let midiio;
let signalio;
let audioio;

// For development we support purging all data
let purge = getq("purge");
let load = getq("load");

store = configureStore({
  reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(
        thunkMiddleware,
        ...(PRODUCTION || !loggerMiddleware ? [] : [loggerMiddleware])
      ),
})

persistor = persistStore(store);
if (purge) {
  persistor.purge();
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

// Load default preset if starting fresh or purging
if (purge || (!load && localStorage.getItem('persist:root') === null)) {
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
  <ErrorBoundary>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </ErrorBoundary>
);
