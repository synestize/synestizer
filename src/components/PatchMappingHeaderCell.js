import React, { PropTypes } from 'react'

const PatchMappingHeaderCell = ({val, scope, name}) => {
  let divStyle = {
    width: transform.bipolPerc(val || 0.0)+"%"
  };
  return (<th scope={scope || "column"}>
    <div className="state-bar" style={divStyle} />
    {name}
  </th>);
};


PatchMappingHeaderCell.propTypes = {
  val: PropTypes.number.isRequired,
  scope: PropTypes.oneOf(["row", "column"]),
  name: PropTypes.string.isRequired,
}

export default PatchMappingHeaderCell;
