(function( global, document, Rx, React, ReactDOM) {
  'use strict';
  
  var ui;
  
  global.ui = ui = global.ui || {};
  
  class MidiInComponent extends React.Component {  
    render() {
      return <div class="Widget">
        <h2>Midi In</h2>
          <select name="midiInDevice" id="midiInDevice" disabled="true" class="midiselect"><option>none</option></select>
        </div>

    }
  }
  

})(this, document, Rx, React, ReactDOM);
