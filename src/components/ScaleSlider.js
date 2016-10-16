import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'

const ScaleSlider = ({
  scale=0.5,
  perturb=0,
  className="",
  width=80,
  height=32,
  onChange=()=>null,
  scaleArrowFill="blue",
  scaleBackingFill="black",
  tickColor="orange",
  x=0,
  y=0
}) => {
  const midX = width/2;
  const midY = height/2;
  const left = midX - scale * midX;
  const right = midX + scale * midX;
  console.debug('pol', `${left} 0, ${right} ${midY}, ${left} ${height}`)
  return (<svg
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink" >
      <style>
          { `.backing { fill: ${scaleBackingFill} };` }
      </style>
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        className="backing" />
      <line
        x1={midX}
        x2={midX}
        y1={0}
        y2={height}
        stroke={tickColor}
        fill="transparent"
        strokeWidth="2"/>
      <polygon points={`${left} 0, ${right} ${midY}, ${left} ${height}`} style={{fill:scaleArrowFill}} transform={`translate(${x},${y})`}
      />
    </svg>
  )
};

ScaleSlider.propTypes = {
  bias: PropTypes.number,
  scale: PropTypes.number,
  value: PropTypes.number,
  perturb: PropTypes.number,
  x: PropTypes.string,
  y: PropTypes.string,
  onChange: PropTypes.func,
  scaleArrowFill: PropTypes.string,
  scaleBackingFill: PropTypes.string,
  className: PropTypes.string,
}

export default ScaleSlider
