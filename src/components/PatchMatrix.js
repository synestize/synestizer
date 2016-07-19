import React, { PropTypes } from 'react'
import PatchMappingControl from './PatchMappingControl'
import PatchMappingHeaderCell from './PatchMappingHeaderCell'

const PatchMatrix = (props) => {
  let bodyRows = [];
  let header = [<th key="header"></th>];
  let sourceNames = Array.from(props.sourceMap.keys()).sort();
  let sinkNames = Array.from(props.sinkMap.keys()).sort();

  for (var sinkName of sinkNames) {
    header.push(<StreamPatchMappingHeaderCell key={sinkName} name={sinkName} scope="column" val={props.sinkState.get(sinkName) || 0.0} />);

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
PatchMatrix.propTypes = {
  children: PropTypes.node.isRequired
}

export default PatchMatrix;
