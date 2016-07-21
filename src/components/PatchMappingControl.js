import React, { PropTypes } from 'react'

const PatchMappingControl = ({val, sourceKey, sinkKey, onChange}) => {
  return (<td className={"mapping " + ((val>0) ? "plus " : "minus ") + ((val!==0) ? "active" : "inactive")}>
  <input
    className="param"
    type="range"
    value={val}
    onChange={onChange}
    min="-1"
    max="1"
    step="0.125"
  />
  </td>)
};

PatchMappingControl.propTypes = {
  val: PropTypes.node.isRequired,
  sourceKey: PropTypes.string.isRequired,
  sinkKey: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default PatchMappingControl;
