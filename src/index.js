// Main entry point everything
import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import rootReducer from './reducers'
import App from './containers/App'
import videoio_ from 'io/video'
import midiio_ from 'io/midi'
import signalio_ from 'io/signal'
import {
  getStoredState,
  autoRehydrate,
  createPersistor,
  persistStore,
  createTransform
} from 'redux-persist'
import localForage from 'localForage'
import { getq, arrayAsSet, setAsArray, objAsMap, mapAsObj } from 'lib/browser'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'


/*
We divide Synestizer into two part:

1. "App": React+Redux; the UI which interfaces with React DOM to manage state at the request of the user
2. "IO": Rx.js+browser DOM; the interfaces to browser services such as MIDI, Video, microphones and so on.

From the perspective of the App, IO may as well be running on a remote server.
although of course it is (for the moment) completely local.
IO can get to the app via the store, and updates its state from the store using Rx.

IO needs to put volatile state in the app, although I'm trying to avoid that.
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

//const loggerMiddleware = createLogger()

let store;
let persistor;

let appRoot;
let videoio;
let midiio;
let signalio;
let enhancers = applyMiddleware(
  thunkMiddleware //, // lets us dispatch() functions
  //loggerMiddleware // logs actions
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
  if (typeof window !== "undefined") {
    window.store = store;
    window.persistor = persistor;
    window.React = React;
  }
  signalio = signalio_(store);
  videoio = videoio_(store, signalio, document.getElementById('video-io'));
  midiio = midiio_(store, signalio);

  appRoot = render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('synapp')
  );
})
