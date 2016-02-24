'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var model = require('./models');
var intents = require('./intents');

var StreamPatchPanel = function(props) {
  return (<div className="streamcontrolset">
    <StreamPatchGrid sourceState={props.sourceState} sinkState={props.sinkState} sourceFirehoses={props.sourceFirehoses} sinkFirehoses={props.sinkFirehoses} sourceSinkMapping={props.sourceSinkMapping} />
  </div>)
};
var StreamPatchGrid = function(props) {
  let rows = [];
  let header = [];
  let sourceNames = Array.from(props.sourceFirehoses.keys()).sort();
  let sinkNames = Array.from(props.sinkFirehoses.keys()).sort();
  for (var sinkName of sinkNames) {
    header.push(<th scope="column">{sinkName}</th>)
  }
  return (<table>
    <thead><tr>
      {header}
    </tr></thead>
    <tbody>
      {rows}
    </tbody>
  </table>)
};
var StreamPatchMappingControl = function(props) {
  return (<form><input type="range"></input><input type="checkbox"></input></form>)
};
function render(state, mountpoint) {
  return ReactDOM.render(
    <StreamPatchPanel sourceState={state.sourceState} sinkState={state.sinkState} sourceFirehoses={state.sourceFirehoses} sinkFirehoses={state.sinkFirehoses} sourceSinkMapping={state.sourceSinkMapping} />,
  mountpoint);
};

module.exports = {
  render: render,
};
