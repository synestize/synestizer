import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import ScaleSlider from './ScaleSlider'

const ArchimedeanSlider = ({
  bias=0,
  scale=0,
  value=0,
  perturb=0,
  className="",
  width=256,
  height=96,
  onScaleChange,
  onBiasChange,
  biasFill="brown", // move this to CSS?
  scaleFill="red",
  trackFill="gray",
  biasThumbFill="black",
  tickColor="orange",
}) => {
  const midX = width/2;
  const midY = height/2;
  const thumbSize = midY/2;
  const trackLeft = width/8;
  const trackRight = width - trackLeft;
  const trackHeight = height/8;
  const trackLen = trackRight - trackLeft;
  const trackMidY = 3*height/4;
  const biasThumbX = midX + trackLen /2 * bias;
  const valueThumbX = midX + trackLen /2 * value;
  const x=7;
  const y=12;
  return (
      <svg
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <style>
            { `.track { fill:${trackFill} };
            .biasThumb { fill:${biasThumbFill} ;
              cursor: move;}
            };
            .scaleArrow { fill:${scaleFill};` }
        </style>
        <rect
          x={trackLeft}
          y={trackMidY-trackHeight/2}
          width={trackLen}
          height={trackHeight} />
        <line
          x1={midX}
          x2={midX}
          y1={midY}
          y2={height}
          stroke={tickColor}
          fill="transparent"
          strokeWidth="2"/>
        <rect
          x={trackLeft}
          y={trackMidY-trackHeight/2}
          width={trackLen}
          height={trackHeight} />
        <circle cx={biasThumbX} cy={trackMidY} r={thumbSize} />
        <ScaleSlider scale={scale}
          perturb={perturb}
          width={64}
          height={36}
          onChange={onScaleChange}
          scaleFill={scaleFill}
          transform={`translate(${x},${y})`} />
      </svg>
  )
};
/*  */
ArchimedeanSlider.propTypes = {
  bias: PropTypes.number,
  scale: PropTypes.number,
  value: PropTypes.number,
  perturb: PropTypes.number,
  onBiasChange: PropTypes.func.isRequired,
  onScaleChange: PropTypes.func.isRequired,
}

export default ArchimedeanSlider
