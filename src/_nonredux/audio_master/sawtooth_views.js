'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var intents = require('./intents');
var master = require('../audio_master/views');
var base_views = require('./base_views');

var Sawtooth = function(props) {
  return (<div className="streamcontrolset">
    <h2>Sawtooth controls</h2>
  </div>)
};

module.exports = {
  render: render,
};
