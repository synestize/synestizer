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
      sourceSinkMappingMag={props.sourceSinkMappingMag}
      sourceSinkMappingSign={props.sourceSinkMappingSign}
    />
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
      cells.push(<StreamPatchMappingControl key={sinkName}
        sourceName={sourceName} sinkName={sinkName} mag={props.sourceSinkMappingMag.get(sourceName+"/"+sinkName) || 0.0} sign={props.sourceSinkMappingSign.get(sourceName+"/"+sinkName) || 1.0} />)
    };
    bodyRows.push(<tr key={sourceName}>{cells}</tr>)
  };

  return (<table className="mappingmatrix">
    <thead><tr>
      {header}
    </tr></thead>
    <tbody>
      {bodyRows}
    </tbody>
  </table>)
};
var StreamPatchMappingControl = function(props) {
  return (<td className={"mapping " + ((props.sign>0) ? "plus" : "minus") + " " + ((props.mag>0) ? "active" : "inactive")}>
    <span className="sign" onClick={(ev) => {
        intents.setMappingSign(props.sourceName, props.sinkName, props.sign*-1)
    }}>{(props.sign>0) ? "+" : "-"}</span>
  <input className="mag" type="range" value={props.mag} onChange={(ev) => intents.setMappingMag(props.sourceName, props.sinkName, ev.target.value)} min="0" max="2" step="any" />
  </td>)
};
function render(state, mountpoint) {
  return ReactDOM.render(
    <StreamPatchPanel
      sourceState={state.sourceState}
      sinkState={state.sinkState}
      sourceFirehoses={state.sourceFirehoses}
      sinkFirehoses={state.sinkFirehoses} 
      sourceSinkMappingMag={state.sourceSinkMappingMag} 
      sourceSinkMappingSign={state.sourceSinkMappingSign} 
    />,
  mountpoint);
};

module.exports = {
  render: render,
};
