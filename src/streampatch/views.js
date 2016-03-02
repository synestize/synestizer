'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var model = require('./models');
var intents = require('./intents');

var StreamPatchPanel = function(props) {

  return (<div className="streamcontrolset">
    <StreamPatchGrid
      sourceState={props.sourceState}
      sinkState={props.sinkState}
      sourceFirehoses={props.sourceFirehoses}
      sinkFirehoses={props.sinkFirehoses} 
      sourceSinkMapping={props.sourceSinkMapping} />
  </div>)
};
var StreamPatchGrid = function(props) {
  let bodyRows = [];
  let header = [<th key="header"></th>];
  let sourceNames = Array.from(props.sourceState.keys()).sort();
  let sinkNames = Array.from(props.sinkState.keys()).sort();
  // This could be done best with Rx stream abstractions, I think
  
  // console.debug("in", props.sourceState, sourceNames);
  // console.debug("out", props.sinkState, sinkNames);
  
  for (var sinkName of sinkNames) {
    header.push(<th scope="column" key={sinkName}>{sinkName}</th>);
  };
  for (var sourceName of sourceNames) {
    let cells = [<th scope="row" key="header">{sourceName}</th>];
    for (var sinkName of sinkNames) {
      cells.push(<td key={sinkName}><StreamPatchMappingControl
        sourceName={sourceName} sinkName={sinkName} value={props.sourceSinkMapping.get(sourceName+"--"+sinkName) || 0.0} /></td>)
    };
    bodyRows.push(<tr key={sourceName}>{cells}</tr>)
  };

  return (<table>
    <thead><tr>
      {header}
    </tr></thead>
    <tbody>
      {bodyRows}
    </tbody>
  </table>)
};
var StreamPatchMappingControl = function(props) {
  let sign = (props.value>=0.0 ? 1 : -1);
  let mag = Math.abs(props.value);
  return (<form>
    <input type="checkbox" checked={sign===1} onChange={(ev) => {
        console.debug("ev", ev.target.checked, ev.target.value, sign, mag);
        intents.setMapping(props.sourceName, props.sinkName, mag * (ev.target.checked ? 1 : -1))
    }} />
  <input type="range" value={mag} onChange={(ev) => intents.setMapping(props.sourceName, props.sinkName, ev.target.value * sign)} min="0" max="2" step="any" />
  </form>)
};
function render(state, mountpoint) {
  return ReactDOM.render(
    <StreamPatchPanel
      sourceState={state.sourceState}
      sinkState={state.sinkState}
      sourceFirehoses={state.sourceFirehoses}
      sinkFirehoses={state.sinkFirehoses} 
      sourceSinkMapping={state.sourceSinkMapping} />,
  mountpoint);
};

module.exports = {
  render: render,
};
