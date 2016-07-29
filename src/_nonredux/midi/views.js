'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var intents = require('./intents');

var MidiInSelect = function(props) {
  return (<div className="streamcontrolset">
    <h2>Midi In</h2>
    <MidiSourceSelect activedevice={props.activedevice} alldevices={props.alldevices} />
    <MidiSourceChannelSelect activechannel={props.activechannel} activedevice={props.activedevice} />
    <MidiSourceCCSetSelect activeccs={props.activeccs} activedevice={props.activedevice} />
  </div>)
};
var MidiSourceSelect = function(props) {
  let disabled;
  let deviceOptNodes;
  let selectValue;
  deviceOptNodes = [<option key="none" value="none">none</option>];
  if ((props.alldevices.size>0)) {
    disabled=false;
    selectValue = props.activedevice || "none";
    for (var [key, devicename] of props.alldevices.entries()) {
      deviceOptNodes.push(
        <option key={key} value={key}>{devicename}</option>
      )
    };
  } else {
    selectValue = "none";
    disabled = true;
  };
  return (<div className="streamchooserwidget">
    <label htmlFor="midiSource">Device </label>
    <select name="midiSource" id="midiSource" className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.mapMidiSource(ev.target.value)}>
      {deviceOptNodes}
    </select>
  </div>
  )
};
var MidiSourceChannelSelect = function(props) {
  var disabled, selectValue, channelOptNodes;
  disabled = (props.activedevice !== null);
  selectValue = props.activechannel || 1;
  channelOptNodes = [];
  for (var i=1; i<=16; i++) {
    channelOptNodes.push(
      <option key={i} value={i}>{i}</option>
    );
  };
  return (<div className="streamchooserwidget">
    <label htmlFor="midiInChan">Channel</label>
    <select name="midiInChan" id="midiInChan" className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.mapMidiSourceChannel(parseInt(ev.target.value))}>
      {channelOptNodes}
    </select>
  </div>)
};
var MidiSourceCCSetSelect = function(props) {
  var disabled, selectValue, ccOptNodes=[], htmlName;
  disabled = (props.activedevice !== null);
  for (let i=0; i<=127; i++) {
    ccOptNodes.push(
      <option key={i} value={i}>{i}</option>
    );
  };
  htmlName = "midiSourceCCSet";
  return (<div className="actual streamchooserwidget">
  <label htmlFor={htmlName}>ccs </label>
    <select name={htmlName} multiple={true} id={htmlName} value={
        Array.from(props.activeccs.values())
      } className="midiselect" disable={disabled} onChange={(ev) => {
        /* extracting multiple values is nasty and asymmetrical */
        intents.setMidiSourceCC(
          Array.prototype.slice.call( ev.target.mapedOptions ).map((x)=>parseInt(x.value)))}
    }>
      {ccOptNodes}
    </select>
  </div>);
};
function renderMidiIn(state, mountpoint) {
  return ReactDOM.render(
    <MidiInSelect activedevice={state.activesource} alldevices={state.allsources} activechannel={state.activesourcechannel}
      activeccs={state.activesourceccs} />,
  mountpoint);
};

var MidiOutSelect = function(props) {
  return (<div className="streamcontrolset">
    <h2>Midi Out</h2>
    <MidiSinkSelect activedevice={props.activedevice} alldevices={props.alldevices} />
    <MidiSinkChannelSelect activechannel={props.activechannel} activedevice={props.activedevice} />
    <MidiSinkCCSetSelect activeccs={props.activeccs} activedevice={props.activedevice} />
    <MidiSoloCC activeccs={props.activeccs} solocc={props.solocc} />
  </div>)
};
var MidiSinkSelect = function(props) {
  let disabled;
  let deviceOptNodes;
  let selectValue;
  deviceOptNodes = [<option key="none" value="none">none</option>];

  if ((props.alldevices.size>0)) {
    disabled=false;
    selectValue = props.activedevice;
    for (var [key, devicename] of props.alldevices.entries()) {
      deviceOptNodes.push(
        <option key={key} value={key}>{devicename}</option>
      )
    };
  } else {
    disabled = true;
    selectValue = "none";
  };
  return (<div className="streamchooserwidget">
    <label htmlFor="midiSink">Device </label>
    <select name="midiSink" id="midiSink" className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.mapMidiSink(ev.target.value)}>
      {deviceOptNodes}
    </select>
  </div>
  )
};
var MidiSinkChannelSelect = function(props) {
  var disabled, selectValue, channelOptNodes;
  disabled = (props.activedevice !== null);
  selectValue = props.activechannel || 1;
  channelOptNodes = [];
  for (var i=1; i<=16; i++) {
    channelOptNodes.push(
      <option key={i} value={i}>{i}</option>
    );
  };
  return (<div className="streamchooserwidget">
    <label htmlFor="midiOutChan">Channel</label>
    <select name="midiOutChan" id="midiOutChan" className="midiselect" disable={disabled} value={selectValue} onChange={(ev) => intents.mapMidiSinkChannel(parseInt(ev.target.value))}>
      {channelOptNodes}
    </select>
  </div>)
};
var MidiSinkCCSetSelect = function(props) {
  var disabled, selectValue, ccOptNodes=[], htmlName;
  disabled = (props.activedevice !== null);
  for (let i=0; i<=127; i++) {
    ccOptNodes.push(
      <option key={i} value={i}>{i}</option>
    );
  };
  htmlName = "midiSinkCCSet";
  return (<div className="actual streamchooserwidget">
  <label htmlFor={htmlName}>ccs </label>
    <select name={htmlName} multiple={true} id={htmlName} value={
        Array.from(props.activeccs.values())
      } className="midiselect" disable={disabled} onChange={(ev) => {
        /* extracting multiple values is nasty and asymmetrical */
        intents.setMidiSinkCC(
          Array.prototype.slice.call( ev.target.mapedOptions ).map((x)=>parseInt(x.value)))}
    }>
      {ccOptNodes}
    </select>
  </div>);
};
var MidiSoloCC = function(props) {
  let activeccs = Array.from(props.activeccs.values()).sort();
  let solocontrols = [];
  if (activeccs.length>0) {
    solocontrols.push(<p className="sololabel" key="sololabel">Solo</p>);
    solocontrols.push(<div className={"solobutton" + (props.solocc===null ? " soloed" : "")}
      onClick={(ev) => intents.soloCC(null)} key="nosolo">
        Off
      </div>
    );
  };
  for (let cc of activeccs) {
    let soloed = (cc===props.solocc);
    solocontrols.push(<div className={"solobutton" + (soloed ? " soloed" : "")}
      onClick={(ev)=>intents.soloCC(cc)} key={cc}>{cc}</div>
    );
  };
  return (<div className="solocontrol">{solocontrols}</div>);
};
function renderMidiOut(state, mountpoint) {
  return ReactDOM.render(
    <MidiOutSelect activedevice={state.activesink} alldevices={state.allsinks} activechannel={state.activesinkchannel}
      activeccs={state.activesinkccs} solocc={state.solocc} />,
    mountpoint);
};
module.exports = {
  renderMidiIn: renderMidiIn,
  renderMidiOut: renderMidiOut,
};
