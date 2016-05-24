//Main entry point for whole app
import React, { PropTypes } from 'react'
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Rx from 'rx'

//debug mode:
Rx.config.longStackSupport = true;

const store = createStore(synestizerApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
