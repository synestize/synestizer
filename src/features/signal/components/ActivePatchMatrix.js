import React from 'react';
import { useSelector } from 'react-redux';
import ActivePatchMappingControl from './ActivePatchMappingControl';
import PatchMappingHeaderCell from '../../../components/PatchMappingHeaderCell';

const ActivePatchMatrix = ({ cellHeight = 25, cellWidth = 80 }) => {
  const signalState = useSelector(state => state.signal);
  const volatileSignalState = useSelector(state => state.__volatile.signal);
  
  const {
    sourceSignalMeta,
    sinkSignalMeta,
    sourceSinkScale
  } = signalState;
  
  const {
    sourceSignalValues,
    sinkSignalValues
  } = volatileSignalState;

  let bodyRows = [];
  let sourceKeys = Array.from(Object.keys(sourceSignalMeta)).sort();
  let sinkKeys = Array.from(Object.keys(sinkSignalMeta)).sort();
  
  let header = [<th key="header"></th>];
  for (var sinkKey of sinkKeys) {
    header.push(
      <PatchMappingHeaderCell
        key={"sink-" + sinkKey}
        signalKey={"sink-" + sinkKey}
        name1={sinkSignalMeta[sinkKey].owner}
        name2={sinkSignalMeta[sinkKey].name}
        scope="column"
        val={sinkSignalValues[sinkKey] || 0.0}
        width={cellWidth}
        height={cellHeight}
      />
    );
  }
  
  for (var sourceKey of sourceKeys) {
    let cells = [
      <PatchMappingHeaderCell
        key={"source-" + sourceKey}
        signalKey={"source-" + sourceKey}
        name1={sourceSignalMeta[sourceKey].owner}
        name2={sourceSignalMeta[sourceKey].name}
        scope="row"
        val={sourceSignalValues[sourceKey] || 0.0}
        width={cellWidth}
        height={cellHeight}
      />
    ];
    
    for (var sinkKey of sinkKeys) {
      cells.push(
        <td className="mapping" key={"sink-" + sinkKey}>
          <ActivePatchMappingControl
            sourceKey={sourceKey}
            sinkKey={sinkKey}
            width={cellWidth}
            height={cellHeight}
          />
        </td>
      );
    }
    
    bodyRows.push(<tr key={sourceKey}>{cells}</tr>);
  }

  return (
    <table className="mappingmatrix">
      <thead>
        <tr>{header}</tr>
      </thead>
      <tbody>{bodyRows}</tbody>
    </table>
  );
};

export default ActivePatchMatrix;