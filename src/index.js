// Main entry point everything
"use strict";

import Rx from 'rx'
import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import rootReducer from './reducers/index'
import App from './containers/App'
import videoio_ from 'io/video/index'
import midiio_ from 'io/midi/index'
import streamio_ from 'io/stream/index'
import { getStoredState, autoRehydrate, createPersistor, persistStore, createTransform } from 'redux-persist'
import localForage from 'localForage'
import { getq, arrayAsSet, setAsArray, objAsMap, mapAsObj } from 'lib/browser'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

//debug mode:
Rx.config.longStackSupport = true;

/*
We divide Synestizer into two part:

1. "App": React+Redux; the UI which interfaces with React DOM to manage state at the request of the user
2. "IO": Rx.js+browser DOM; the interfaces to browser services such as MIDI, Video, microphones and so on.

From the perspective of the App, IO may as well be running on a remote server. although of course it is (for the moment) completely local.
IO can get to the app via the store, and updates its state from the store using Rx.

IO might need to put volatile state in the app, although I'm trying to avoid that.
If it happens, I will name that stat with a double underscore prefix
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

let store;
let persistor;

let appRoot;
let videoio;
let midiio;
let streamio;
let enhancers = applyMiddleware(
  thunkMiddleware, // lets us dispatch() functions
  loggerMiddleware // neat middleware that logs actions
)

getStoredState(persistConf, (err, restoredState) => {
  //For development we support purging all data
  if (getq("purge")) {
    console.warn("purging all local data");
    store = createStore(rootReducer, undefined, enhancers)
    persistor = createPersistor(store, persistConf)
    persistor.purgeAll();
  } else {
    store = createStore(rootReducer, restoredState, enhancers)
    persistor = createPersistor(store, persistConf)
  }
  window.store = store;
  window.persistor = persistor;

  streamio = streamio_(store);
  videoio = videoio_(store, streamio, document.getElementById('video-io'));
  midiio = midiio_(store, streamio);

  appRoot = render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('synapp')
  );
})
