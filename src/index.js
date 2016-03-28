//Main entry point for whole app
"use strict";

let React = require('react');
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
let Rx = require('rx');

//debug mode:
Rx.config.longStackSupport = true;

let store = createStore(todoApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)

