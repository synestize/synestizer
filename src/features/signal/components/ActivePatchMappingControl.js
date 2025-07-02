import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSourceSinkScale } from '../signalSlice';
import SVG from '../../../components/SVG';
import ScaleSliderSVG from '../../../components/ScaleSliderSVG';

const ActivePatchMappingControl = ({ sourceKey, sinkKey, width = 80, height = 25 }) => {
  const dispatch = useDispatch();
  const scale = useSelector(state => 
    state.signal.sourceSinkScale[sourceKey + '/' + sinkKey] || 0.0
  );

  const handleChange = (val = 0) => {
    dispatch(setSourceSinkScale(sourceKey, sinkKey, val));
  };

  const handleDoubleClick = () => {
    dispatch(setSourceSinkScale(sourceKey, sinkKey, 0.0));
  };

  return (
    <SVG width={width} height={height}>
      <ScaleSliderSVG
        scale={scale}
        onChange={handleChange}
        onDoubleClick={handleDoubleClick}
        width={width}
        height={height}
      />
    </SVG>
  );
};

export default ActivePatchMappingControl;