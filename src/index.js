// Main entry point everything
"use strict";

import Rx from 'rx'
import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import rootReducer from './reducers/index'
import PaneSet from './components/PaneSet'
import videoio_ from 'io/video/index'

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

const store = createStore(rootReducer);

const appRoot = render(
  <Provider store={store}>
    <PaneSet />
  </Provider>,
  document.getElementById('app')
);

const videoio = videoio_(store, document.getElementById('video-io'));
