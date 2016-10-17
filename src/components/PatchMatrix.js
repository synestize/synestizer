import React, { PropTypes } from 'react'
import ActivePatchMappingControl from '../containers/ActivePatchMappingControl'
import PatchMappingHeaderCell from './PatchMappingHeaderCell'

/*
* How the hell did i make a presentational componenet which includes so much state management?
* needs refactor
*/

const PatchMatrix = ({
    sourceSignalMeta,
    sourceSignalValues,
    sinkSignalMeta,
    sinkSignalValues,
    sourceSinkScale
  }) => {
  let bodyRows = [];
  let sourceKeys = Array.from(Object.keys(sourceSignalMeta)).sort();
  let sinkKeys = Array.from(Object.keys(sinkSignalMeta)).sort();
  // let sourceKeys = sourceKeys.map((k)=>sourceSignalMeta[k]);
  // let sinkKeys = sinkKeys.map((k)=>sinkSignalMeta[k]);
  let header = [<th key="header"></th>];
  for (var sinkKey of sinkKeys) {
    header.push(<PatchMappingHeaderCell
      key={"sink-" + sinkKey}
      signalKey={"sink-" + sinkKey}
      name={sinkSignalMeta[sinkKey].owner + "/" + sinkSignalMeta[sinkKey].name}
      scope="column"
      val={sinkSignalValues[sinkKey] || 0.0} />);
  };
  for (var sourceKey of sourceKeys) {
    let cells = [<PatchMappingHeaderCell
      key={"source-" + sourceKey}
      signalKey={"source-" + sourceKey}
      name={sourceSignalMeta[sourceKey].owner + "/" + sourceSignalMeta[sourceKey].name}
      scope="row"
      val={sourceSignalValues[sourceKey] || 0.0} />];
    for (var sinkKey of sinkKeys) {
      cells.push(<td className="mapping" key={"sink-" + sinkKey}>
        <ActivePatchMappingControl
          sourceKey={sourceKey}
          sinkKey={sinkKey}
          width={80}
          height={32}
        />
      </td>)
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
  sourceSinkScale: PropTypes.object.isRequired
}

export default PatchMatrix;
