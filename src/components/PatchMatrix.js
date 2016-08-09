import React, { PropTypes } from 'react'
import ActivePatchMappingControl from '../containers/ActivePatchMappingControl'
import PatchMappingHeaderCell from './PatchMappingHeaderCell'

const PatchMatrix = ({
    sourceSignalMeta,
    sourceSignalValues,
    sinkSignalMeta,
    sinkSignalValues,
    sourceSinkScale,
    sinkBias
  }) => {
  let bodyRows = [];
  let sourceKeys = Array.from(Object.keys(sourceSignalMeta)).sort();
  let sinkKeys = Array.from(Object.keys(sinkSignalMeta)).sort();
  // let sourceKeys = sourceKeys.map((k)=>sourceSignalMeta[k]);
  // let sinkKeys = sinkKeys.map((k)=>sinkSignalMeta[k]);
  let header = [<th key="header"></th>];
  for (var sinkKey of sinkKeys) {
    header.push(<PatchMappingHeaderCell
      key={sinkKey}
      name={sinkSignalMeta[sinkKey]}
      scope="column"
      val={sinkSignalValues[sinkKey] || 0.0} />);
  };
  for (var sourceKey of sourceKeys) {
    let cells = [<PatchMappingHeaderCell
      key="source"
      name={sourceSignalMeta[sourceKey]}
      scope="row"
      val={sourceSignalValues[sourceKey] || 0.0} />];
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
  sourceSignalMeta: PropTypes.object.isRequired,
  sourceSignalValues: PropTypes.object.isRequired,
  sinkSignalMeta: PropTypes.object.isRequired,
  sinkSignalValues: PropTypes.object.isRequired,
  sourceSinkScale: PropTypes.object.isRequired,
  sinkBias: PropTypes.object.isRequired,
}

export default PatchMatrix;
