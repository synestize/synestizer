'use strict';

var Rx = require('Rx');
var React = require('react');
var ReactDOM = require('react-dom');
var intents = require('./intents');
var transform = require('../lib/transform.js');

var StreamPatchPanel = function(props) {
  return (<div className="streamcontrolset">
    <StreamPatchGrid
      sourceMap={props.sourceMap}
      sinkMap={props.sinkMap}
      sourceState={props.sourceState}
      sinkState={props.sinkState}
      sourceSinkMappingMag={props.sourceSinkMappingMag}
      sourceSinkMappingSign={props.sourceSinkMappingSign}
    />
  </div>)
};
var StreamPatchGrid = function(props) {
  let bodyRows = [];
  let header = [<th key="header"></th>];
  let sourceNames = Array.from(props.sourceMap.keys()).sort();
  let sinkNames = Array.from(props.sinkMap.keys()).sort();
  
  // This could be done best with Rx stream abstractions, I think
  // console.debug("in", props.sourceState, sourceNames);
  // console.debug("out", props.sinkState, sinkNames);
  for (var sinkName of sinkNames) {
    header.push(<StreamPatchMappingHeaderCell key={sinkName} name={sinkName} scope="column" val={props.sinkState.get(sinkName) || 0.0} />);
    //console.debug("sink", sinkName, props.sinkState.get(sinkName));
  };
  for (var sourceName of sourceNames) {
    let cells = [<StreamPatchMappingHeaderCell key="source" name={sourceName} scope="row" val={props.sourceState.get(sourceName) || 0.0}/>];
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
  <input className="param" type="range" value={props.mag} onChange={(ev) => intents.setMappingMag(props.sourceName, props.sinkName, ev.target.value)} min="0" max="2" step="any" onDoubleClick={(ev) => {
      intents.setMappingSign(props.sourceName, props.sinkName, props.sign*-1)
  }} />
  </td>)
};
var StreamPatchMappingHeaderCell = function(props) {
  let divStyle = {
    width: transform.bipolPerc(props.val || 0.0)+"%"
  };
  return (<th scope={props.scope || "column"}>
    <div className="stateBar" style={divStyle}></div>
    {props.name}
  </th>);
};

function render(state, mountpoint) {
  return ReactDOM.render(
    <StreamPatchPanel
      sourceMap={state.sourceMap}
      sinkMap={state.sinkMap}
      sourceState={state.sourceState}
      sinkState={state.sinkState}
      sourceSinkMappingMag={state.sourceSinkMappingMag} 
      sourceSinkMappingSign={state.sourceSinkMappingSign} 
    />,
  mountpoint);
};

module.exports = {
  render: render,
};
