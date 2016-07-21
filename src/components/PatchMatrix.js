import React, { PropTypes } from 'react'
import PatchMappingControl from './PatchMappingControl'
import PatchMappingHeaderCell from './PatchMappingHeaderCell'

const PatchMatrix = ({
    sourceStreamMeta,
    sourceStreamValues,
    sinkStreamMeta,
    sinkStreamValues,
    sourceSinkScale,
    sinkBias
  }) => {
  let bodyRows = [];
  let header = [<th key="header"></th>];
  let sourceNames = Array.from(sourceMap.keys()).sort();
  let sinkNames = Array.from(sinkMap.keys()).sort();

  for (var sinkName of sinkNames) {
    header.push(<StreamPatchMappingHeaderCell key={sinkName} name={sinkName} scope="column" val={sinkState.get(sinkName) || 0.0} />);

  };
  for (var sourceName of sourceNames) {
    let cells = [<StreamPatchMappingHeaderCell key="source" name={sourceName} scope="row" val={sourceState.get(sourceName) || 0.0}/>];
    for (var sinkName of sinkNames) {
      cells.push(<StreamPatchMappingControl key={sinkName}
        sourceName={sourceName} sinkName={sinkName} mag={sourceSinkMappingMag.get(sourceName+"/"+sinkName) || 0.0} sign={sourceSinkMappingSign.get(sourceName+"/"+sinkName) || 1.0} />)
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
  sourceStreamMeta: PropTypes.object.isRequired,
  sourceStreamValues: PropTypes.object.isRequired,
  sinkStreamMeta: PropTypes.object.isRequired,
  sinkStreamValues: PropTypes.object.isRequired,
  sourceSinkScale: PropTypes.object.isRequired,
  sinkBias: PropTypes.object.isRequired,
}

export default PatchMatrix;
