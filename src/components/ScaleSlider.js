import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'

const ScaleSlider = ({
  scale=0,
  perturb=0,
  className="",
  width=64,
  height=36,
  onChange,
  scaleFill="red",
  x=0,
  y=0
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

  return (<div className={"param-control " + className} >
    <svg
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <style>
          { `.track { fill: ${trackFill} };` }
      </style>
      <polygon points={`50 160, 55 180, 70 180, 60 190, 65 205, 50 195, 35 205, 40 190, 30 180, 45 180`} style={{fill:'blue'}} transform={`translate(${x},${y})`}/>
    </svg>
  </div>)
};

ScaleSlider.propTypes = {
  bias: PropTypes.number,
  scale: PropTypes.number,
  value: PropTypes.number,
  perturb: PropTypes.number,
  onScaleChange: PropTypes.func.isRequired,
}

export default ScaleSlider
