//Main entry point for whole app
import React, { PropTypes } from 'react'
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Rx from 'rx'
import synestizerApp from './app';
import App from './views/app';
//debug mode:
Rx.config.longStackSupport = true;

const store = createStore(synestizerApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
