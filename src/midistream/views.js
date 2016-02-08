'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var model = require('./models');
var intents = require('./intents');

var MidiInSelect = function(props) {
  return (<div className="widget">
    <h2>Midi In</h2>
    <MidiInDeviceSelect activedevice={props.activedevice} alldevices={props.alldevices} />
    <MidiInChannelSelect activechannel={props.activechannel} activedevice={props.activedevice} />
    <MidiInCCSetSelect activeccs={props.activeccs} activedevice={props.activedevice} />
  </div>)
};
var MidiInDeviceSelect = function(props) {
  let disabled;
  let deviceOptNodes;
  let selectValue;
  if ((props.alldevices.size>0)) {
    disabled=false;
    selectValue = props.activedevice;
    deviceOptNodes = [];
    for (var [key, devicename] of props.alldevices.entries()) {
      deviceOptNodes.push(
        <option key={key} value={key}>{devicename}</option>
      )
    };
  } else {
    disabled = true;
    selectValue = "none";
    deviceOptNodes = [<option key="none" value="none">none</option>];
  };
  return (<div>
    <label htmlFor="midiInDevice">Device </label>
    <select name="midiInDevice" id="midiInDevice" className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.selectMidiInDevice(ev.target.value)}>
      {deviceOptNodes}
    </select>
  </div>
  )
};
var MidiInChannelSelect = function(props) {
  var disabled, selectValue, channelOptNodes;
  disabled = (props.activedevice !== null);
  selectValue = props.activechannel || 1;
  channelOptNodes = [];
  for (var i=1; i<=16; i++) {
    channelOptNodes.push(
      <option key={i} value={i}>{i}</option>
    );
  };
  return (<div>
    <label htmlFor="midiInChan">Channel</label>
    <select name="midiInChan" id="midiInChan" className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.selectMidiInChannel(parseInt(ev.target.value))}>
      {channelOptNodes}
    </select>
  </div>)
};
var MidiInCCSetSelect = function(props) {
  var disabled, selectValue, ccSelectNodes, sorted;
  ccSelectNodes = [];
  disabled = (props.activedevice !== null);
  // sort by numerical value of cc
  sorted = Array.from(props.activeccs).sort((a,b)=>a-b);
  sorted.forEach(function(ccNum) {
    ccSelectNodes.push(
      <MidiInCCSelect ccNum={ccNum} key={ccNum} activedevice={props.activedevice} activeccs={props.activeccs} />
    );
  });
  ccSelectNodes.push(
    <MidiInCCSelect key="add" activedevice={props.activedevice} activeccs={props.activeccs} />
  );
  return (<div className="widget">
    {ccSelectNodes}
  </div>
  )
};
var MidiInCCSelect = function(props) {
  var disabled, selectValue, ccOptNodes=[], htmlName;
  disabled = (props.activedevice !== null);
  selectValue = props.ccNum;
  for (let i=0; i<=127; i++) {
    ccOptNodes.push(
      <option key={i} value={i} disabled={props.activeccs.has(i)} >{i}</option>
    );
  };
  //find a free cc num
  if (selectValue == undefined) {
    for (let i=0; props.activeccs.has(i); i++) {
      selectValue = i;
    };
    htmlName = "midiInCC-new";
    return (<div className="inactive">
    <label htmlFor={htmlName}>create cc </label>
      <select name={htmlName} id={htmlName} className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.addMidiInCC(parseInt(ev.target.value))}>
        {ccOptNodes}
      </select>
    </div>);
  } else {
    htmlName = "midiInCC-" + props.ccNum;
    return (<div className="active">
    <label htmlFor={htmlName}>cc </label>
      <select name={htmlName} id={htmlName} className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.swapMidiInCC(selectValue, parseInt(ev.target.value))}>
        {ccOptNodes}
      </select>
      <button onClick={()=>intents.removeMidiInCC(selectValue)}>
        -
      </button>
    </div>);
  };
};
function renderMidiIn(state, mountpoint) {
  return ReactDOM.render(
    <MidiInSelect activedevice={state.activeindevice} alldevices={state.allindevices} activechannel={state.activeinchannel}
      activeccs={state.activeinccs} />,
  mountpoint);
};


var MidiOutSelect = function(props) {
  return (<div className="widget">
    <h2>Midi Out</h2>
    <MidiOutDeviceSelect activedevice={props.activedevice} alldevices={props.alldevices} />
    <MidiOutChannelSelect activechannel={props.activechannel} activedevice={props.activedevice} />
    <MidiOutCCSetSelect activeccs={props.activeccs} activedevice={props.activedevice} />
  </div>)
};
var MidiOutDeviceSelect = function(props) {
  let disabled;
  let deviceOptNodes;
  let selectValue;
  if ((props.alldevices.size>0)) {
    disabled=false;
    selectValue = props.activedevice;
    deviceOptNodes = [];
    for (var [key, devicename] of props.alldevices.entries()) {
      deviceOptNodes.push(
        <option key={key} value={key}>{devicename}</option>
      )
    };
  } else {
    disabled = true;
    selectValue = "none";
    deviceOptNodes = [<option key="none" value="none">none</option>];
  };
  return (<div>
    <label htmlFor="midiOutDevice">Device </label>
    <select name="midiOutDevice" id="midiOutDevice" className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.selectMidiOutDevice(ev.target.value)}>
      {deviceOptNodes}
    </select>
  </div>
  )
};
var MidiOutChannelSelect = function(props) {
  var disabled, selectValue, channelOptNodes;
  disabled = (props.activedevice !== null);
  selectValue = props.activechannel || 1;
  channelOptNodes = [];
  for (var i=1; i<=16; i++) {
    channelOptNodes.push(
      <option key={i} value={i}>{i}</option>
    );
  };
  return (<div>
    <label htmlFor="midiOutChan">Channel</label>
    <select name="midiOutChan" id="midiOutChan" className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.selectMidiOutChannel(parseInt(ev.target.value))}>
      {channelOptNodes}
    </select>
  </div>)
};
var MidiOutCCSetSelect = function(props) {
  var disabled, selectValue, ccSelectNodes, sorted;
  ccSelectNodes = [];
  disabled = (props.activedevice !== null);
  // sort by numerical value of cc
  sorted = Array.from(props.activeccs).sort((a,b)=>a-b);
  sorted.forEach(function(ccNum) {
    ccSelectNodes.push(
      <MidiOutCCSelect ccNum={ccNum} key={ccNum} activedevice={props.activedevice} activeccs={props.activeccs} />
    );
  });
  ccSelectNodes.push(
    <MidiOutCCSelect key="add" activedevice={props.activedevice} activeccs={props.activeccs} />
  );
  return (<div className="widget">
    {ccSelectNodes}
  </div>
  )
};
var MidiOutCCSelect = function(props) {
  var disabled, selectValue, ccOptNodes=[], htmlName;
  disabled = (props.activedevice !== null);
  selectValue = props.ccNum;
  for (let i=0; i<=127; i++) {
    ccOptNodes.push(
      <option key={i} value={i} disabled={props.activeccs.has(i)} >{i}</option>
    );
  };
  //find a free cc num
  if (selectValue == undefined) {
    for (let i=0; props.activeccs.has(i); i++) {
      selectValue = i;
    };
    htmlName = "midiOutCC-new";
    return (<div className="inactive">
    <label htmlFor={htmlName}>create cc </label>
      <select name={htmlName} id={htmlName} className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.addMidiOutCC(parseInt(ev.target.value))}>
        {ccOptNodes}
      </select>
    </div>);
  } else {
    htmlName = "midiOutCC-" + props.ccNum;
    return (<div className="active">
    <label htmlFor={htmlName}>cc </label>
      <select name={htmlName} id={htmlName} className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.swapMidiOutCC(selectValue, parseInt(ev.target.value))}>
        {ccOptNodes}
      </select>
      <button onClick={()=>intents.removeMidiOutCC(selectValue)}>
        -
      </button>
    </div>);
  };
};
function renderMidiOut(state, mountpoint) {
  return ReactDOM.render(
    <MidiOutSelect activedevice={state.activeoutdevice} alldevices={state.alloutdevices} activechannel={state.activeoutchannel}
      activeccs={state.activeoutccs}  />,
    mountpoint);
};
module.exports = {
  renderMidiIn: renderMidiIn,
  renderMidiOut: renderMidiOut,
};
