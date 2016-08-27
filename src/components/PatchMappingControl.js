import React, { PropTypes } from 'react'
import Icon from './Icon'

const PatchMappingControl = ({val, sourceKey, sinkKey, onSetScale}) => {
  return (<td className={"mapping " + ((val>=0) ? "plus " : "minus ") + ((val!==0) ? "active" : "inactive")}>
    <input
      className="param"
      type="range"
      value={val}
      onChange={(ev)=>onSetScale(parseFloat(ev.target.value))}
      min="-1"
      max="1"
      step="0.125"
    />
    <Icon name="ban" onClick={()=>onSetScale(0)} />
  </td>)
};

PatchMappingControl.propTypes = {
  val: PropTypes.node.isRequired,
  sourceKey: PropTypes.string.isRequired,
  sinkKey: PropTypes.string.isRequired,
  onSetScale: PropTypes.func.isRequired,
}

export default PatchMappingControl;
