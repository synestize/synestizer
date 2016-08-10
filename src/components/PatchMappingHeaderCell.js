import React, { PropTypes } from 'react'
import {bipolPerc} from '../lib/transform'

const PatchMappingHeaderCell = ({val, scope, name, signalKey}) => {
  let divStyle = {
    width: bipolPerc(val || 0.0)+"%"
  };
  return (<th scope={scope || "column"} data-signal={signalKey}>
    <div className="state-bar" style={divStyle} />
    <span className='signalname'>{name}</span>
  </th>);
};


PatchMappingHeaderCell.propTypes = {
  val: PropTypes.number.isRequired,
  scope: PropTypes.oneOf(["row", "column"]),
  name: PropTypes.string.isRequired,
  signalKey: PropTypes.string.isRequired,
}

export default PatchMappingHeaderCell;
