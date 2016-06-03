//Main entry point for whole app
//Main entry point for whole app
"use strict";

import Rx from 'rx'
import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { combineReducers, createStore } from 'redux'

import * as reducers from './reducers'
import CurrentApp from './containers/CurrentApp'

console.debug(reducers);
//debug mode:
Rx.config.longStackSupport = true;

const synestizerApp = combineReducers(reducers)
const store = createStore(synestizerApp)

const root = render(
  <Provider store={store}>
    <CurrentApp />
  </Provider>,
  document.getElementById('app')
);

// Now root.children[0].getWrappedInstance().videoDom.... should be the video elem?
// That is insane; we want to have these DOM services managed outside of react, I think.
// See also https://facebook.github.io/react/docs/top-level-api.html#reactdom.finddomnode
// We should keep a reference to the store here and pump updates from the the normal DOM into it.
// Accordingly we could rename "App" into "GUI"
export default root;
