//Main entry point for whole app
"use strict";

let React = require('react');
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

let store = createStore(todoApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
var Rx = global.Rx = require('Rx');
//debug mode:
Rx.config.longStackSupport = true;

var pureTabs = global.pureTabs = require('./vendor/puretabs/puretabs.js');
pureTabs.init('tabs-link', 'tabs-link-active');

var MidiApp = require('./midi/app');
var VideoApp = require('./video/app');
var StreamPatchApp = require('./streampatch/app');
var AudioMasterApp = require('./audio_master/app');
var AudioJustSawtoothApp = require('./audio_justsawtooth/app');

MidiApp(
  document.getElementById('midi-input'),
  document.getElementById('midi-output')
);

VideoApp(
  document.getElementById('video-input'),
  document.getElementById('video-display')
);

var audioapp = AudioMasterApp(
  document.getElementById('audio-master')
);

AudioJustSawtoothApp(
  document.getElementById('audio-justsawtooth')
);

StreamPatchApp(
  document.getElementById('iomatrix-tab')
);
