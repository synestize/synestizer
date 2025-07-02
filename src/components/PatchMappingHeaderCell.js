import React from 'react'
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



export default PatchMappingHeaderCell;
