'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');

class MidiInComponent extends React.Component {  
  render() {
    return <div class="Widget">
      <h2>Midi In</h2>
        <select name="midiInDevice" id="midiInDevice" disabled="true" class="midiselect"><option>none</option></select>
      </div>

  }
}

module.exports = {
  MidiInComponent: MidiInComponent
};