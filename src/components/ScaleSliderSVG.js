import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'

const ScaleSliderSVG = ({
  scale=0.5,
  perturb=undefined,
  className='',
  width=80,
  height=32,
  onChange=()=>null,
  scaleArrowFill='blue',
  scaleBackingFill='black',
  perturbArrowFill='rgba(0,0,255,0.8)',
  tickColor='orange',
  x=0,
  y=0,
  transform=''
}) => {
  const midX = width/2;
  const midY = height/2;
  const left = midX - scale * midX;
  const right = midX + scale * midX;
  let arrow = <polygon
    points={`${left} 0, ${right} ${midY}, ${left} ${height}`}
    style={{fill:scaleArrowFill}}
  />
  let shadowArrow;
  const shadowing = (typeof(perturb)==='number');
  if (shadowing) {
    let shadowLeft = midX;
    let shadowRight = midX + scale * perturb * midX;

    shadowArrow = <polygon
      points={`${shadowLeft} 0, ${shadowRight} ${midY}, ${shadowLeft} ${height}`}
      style={{fill:perturbArrowFill}}
    />
  }
  return (<g transform={transform}>
      <style>
          { `.backing { fill: ${scaleBackingFill} };` }
      </style>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        className='backing' />
      {arrow}
      {shadowArrow}
      <line
        x1={midX}
        x2={midX}
        y1={0}
        y2={height}
        stroke={tickColor}
        fill='transparent'
        strokeWidth='2'
      />
    </g>
  )
};

ScaleSliderSVG.propTypes = {
  bias: PropTypes.number,
  scale: PropTypes.number,
  value: PropTypes.number,
  perturb: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  onChange: PropTypes.func,
  scaleArrowFill: PropTypes.string,
  scaleBackingFill: PropTypes.string,
  className: PropTypes.string,
}

export default ScaleSliderSVG
