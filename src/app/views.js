'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var models = require('./models');
var intents = require('./intents');
var MidiViews = require('../midistream/views');


//somthing liek import { TestComponent } from './components/TestComponent.jsx'
//https://stackoverflow.com/questions/33523736/reactjs-cant-import-component
// https://christianalfoni.github.io/react-webpack-cookbook/Configuring-react-js.html
// https://discuss.reactjs.org/t/es6-import-as-react-vs-import-react/360/6
var AppView = function(props) {
  return (<div className="widget">
    <MidiViews.MidiIn />
  </div>)
};

function renderApp(state, mountpoint) {
  return ReactDOM.render(
    <AppView state={state}  />,
    mountpoint);
};

module.exports = {
  renderApp: renderApp,
};
