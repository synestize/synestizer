import React, { PropTypes } from 'react'

const PatchMappingControl = ({val, sourceKey, sinkKey, mag, sign}) => {
  return (<td className={"mapping " + ((sign>0) ? "plus" : "minus") + " " + ((mag>0) ? "active" : "inactive")}>
  <input className="param" type="range" value={mag} onChange={(ev) => intents.setMappingMag(sourceKey, sinkKey, ev.target.value)} min="0" max="2" step="any" onDoubleClick={(ev) => {
      intents.setMappingSign(sourceKey, sinkKey, sign*-1)
  }} />
  </td>)
};

PatchMappingControl.propTypes = {
  children: PropTypes.node.isRequired
}

export default PatchMappingControl;
