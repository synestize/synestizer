import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import GestureableSVG from './GestureableSVG'

const ScaleSliderSVG = ({
  scale=0.0,
  perturbation=0.0,
  className='',
  width=80,
  height=32,
  onChange,
  onDoubleClick,
  scaleArrowFill='rgba(0,0,255,0.8)',
  scaleBackingFill='black',
  perturbArrowFill='rgba(0,255,255,0.6)',
  tickColor='red',
  transform='',
  label1='',
  label2='',
  labelColor='rgba(200,200,200,1)',
}) => {
  const midX = width/2;
  const midY = height/2;
  const left = midX - scale * midX;
  const right = midX + scale * midX;
  let label1Elem;
  let label2Elem;
  if (label1.length>0) {
    label1Elem = <text
      key='label1'
      x='0'
      y={height*0.5}
      fontSize={height*0.5}
      fontWeight='bold'
      color={labelColor}
      fill={labelColor}
    >
    {label1}
  </text>
  }
  if (label2.length>0) {
    label2Elem = <text
      key='label2'
      x='0'
      y={height}
      fontSize={height*0.5}
      fontWeight='bold'
      color={labelColor}
      fill={labelColor}
    >
    {label2}
  </text>
  }

  let arrow ;
  arrow = <polygon
    points={`${left} 0, ${right} ${midY}, ${left} ${height}`}
    style={{fill:scaleArrowFill}}
  />
  let shadowArrow;
  let shadowLeft = midX;
  let shadowRight = midX + perturbation * midX;

  shadowArrow = <polygon
    points={`${shadowLeft} 0, ${shadowRight} ${midY}, ${shadowLeft} ${height}`}
    style={{fill:perturbArrowFill}}
  />
  return (<GestureableSVG
      width={width}
      height={height}
      onChange={onChange}
      onDoubleClick={onDoubleClick}
      value={scale}
      transform={transform}
    >
    <style>
        { `.backing { fill: ${scaleBackingFill} };` }
    </style>
    <rect
      x={0}
      y={0}
      width={width}
      height={height}
      className='backing'
    />
    {shadowArrow}
    {arrow}
    <line
      x1={midX}
      x2={midX}
      y1={0}
      y2={height}
      stroke={tickColor}
      fill='transparent'
      strokeWidth='1'
    />
    {label1Elem}
    {label2Elem}
    </GestureableSVG>
  )
};

ScaleSliderSVG.propTypes = {
  scale: PropTypes.number,
  value: PropTypes.number,
  perturbation: PropTypes.number,
  onChange: PropTypes.func,
  scaleArrowFill: PropTypes.string,
  scaleBackingFill: PropTypes.string,
  className: PropTypes.string,
  transform: PropTypes.string,
  label: PropTypes.string,
}

export default ScaleSliderSVG
