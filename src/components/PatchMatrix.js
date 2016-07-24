import React, { PropTypes } from 'react'
import ActivePatchMappingControl from '../containers/ActivePatchMappingControl'
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
  let sourceKeys = Array.from(Object.keys(sourceStreamMeta)).sort();
  let sinkKeys = Array.from(Object.keys(sinkStreamMeta)).sort();
  // let sourceKeys = sourceKeys.map((k)=>sourceStreamMeta[k]);
  // let sinkKeys = sinkKeys.map((k)=>sinkStreamMeta[k]);
  let header = [<th key="header"></th>];
  for (var sinkKey of sinkKeys) {
    header.push(<PatchMappingHeaderCell
      key={sinkKey}
      name={sinkKey}
      scope="column"
      val={sourceStreamValues[sinkKey] || 0.0} />);
  };
  for (var sourceKey of sourceKeys) {
    let cells = [<PatchMappingHeaderCell
      key="source"
      name={sourceKey}
      scope="row"
      val={sourceStreamValues[sourceKey] || 0.0} />];
    for (var sinkKey of sinkKeys) {
      cells.push(<ActivePatchMappingControl
        key={sinkKey}
        sourceKey={sourceKey}
        sinkKey={sinkKey}
        val={sourceSinkScale[sourceKey+'/'+sinkKey] || 0.0}
        />)
    };
    bodyRows.push(<tr key={sourceKey}>{cells}</tr>)
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
