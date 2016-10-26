import React, { PropTypes } from 'react'
import ScaleSlider from './ScaleSlider'

const PatchMappingHeaderCell = ({val, scope, name1, name2, signalKey, ...rest}) => {
  return (<th scope={scope || "column"} data-signal={signalKey}>
    <ScaleSlider
      perturbation={val}
      scale={0}
      label1={name1}
      label2={name2}
      {...rest} />
  </th>);
};


PatchMappingHeaderCell.propTypes = {
  val: PropTypes.number.isRequired,
  scope: PropTypes.oneOf(["row", "column"]),
  name1: PropTypes.string.isRequired,
  name2: PropTypes.string.isRequired,
  signalKey: PropTypes.string.isRequired,
}

export default PatchMappingHeaderCell;
