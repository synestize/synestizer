import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import ScaleSliderSVG from './ScaleSliderSVG'

class ArchimedeanSliderSVG extends Component{
  constructor(props) {
    super(props);
    this.inGesture = false;
    this.gestureStartX = 0;
    this.gestureStartY = 0;
    this.gestureStartVal = props.bias || 0.0
  }
  handleMouseDown = (e) => {
    this.inGesture = true;
    this.gestureStartX = e.clientX;
    this.gestureStartY = e.clientY;
    this.gestureStartVal = this.props.bias;
  }
  handleMouseUp = (e) => {
    this.inGesture = false;
  }
  handleMouseLeave = (e) => {
    this.inGesture = false;
  }
  handleMouseMove = (e) => {
    if (this.inGesture) {
      let delta = 2.0 * (e.clientX-this.gestureStartX) / this.props.width
      this.props.onBiasChange(
        Math.max(-1, Math.min(1, this.gestureStartVal + delta)));
    }
  }
  handleDoubleClick = (e) => {
    this.props.onBiasDoubleClick();
  }
  render = () => {
    let {
      bias=0,
      scale=0,
      perturbedValue=0,
      perturb=0,
      className='',
      width=256,
      height=96,
      biasFill='brown', // move this to CSS?
      trackFill='gray',
      scaleArrowFill='blue',
      scaleBackingFill='black',
      perturbArrowFill='rgba(0,0,255,0.8)',
      biasThumbFill='black',
      tickColor='orange',
      biasBackingFill='white',
      binderColor='orange',
      transform='',
      actualColor='orange',
      onBiasDoubleClick,
      onBiasChange,
      onScaleChange,
      onScaleDoubleClick
    } = this.props;
    const biasHeight = 2* height/3;
    const biasTop = height-biasHeight;
    const biasMid = (biasHeight + height)/2;
    const midX = width/2;

    const thumbSize = biasHeight/4;
    const trackHeight = biasHeight/5;
    const trackLeft = thumbSize;
    const trackRight = width - trackLeft;
    const trackLen = trackRight - trackLeft;
    const trackMidY = biasTop + biasHeight/2;
    const biasThumbX = midX + trackLen /2 * bias;
    const valueThumbX = midX + trackLen /2 * perturbedValue;

    const scaleHeight = height - biasHeight;
    const scaleWidth = width/2;
    const scaleLeft = (width - scaleWidth) * (1 + scale) / 2;
    const scaleMidX = scaleLeft + scaleWidth/2;
    const scaleMidY = scaleHeight/2;

    let c = (<g transform={transform}>
        <g
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}
            onMouseLeave={this.handleMouseLeave}
            onDoubleClick={this.handleDoubleClick}
            // onTouchStart={this.handleTouchStart}
            // onTouchEnd={this.handleTouchEnd}
            // onTouchMove={this.handleTouchMove}
          >
          <style>
              { `.track { fill:${trackFill} };
              .biasThumb { fill:${biasThumbFill} ;
                cursor: move;}
              };` }
          </style>
          <rect
            x={0}
            y={biasTop}
            width={width}
            height={biasHeight}
            fill={biasBackingFill}
          />
          <rect
            x={trackLeft}
            y={trackMidY-trackHeight/2}
            width={trackLen}
            height={trackHeight} />
          <line
            x1={midX}
            x2={midX}
            y1={biasTop}
            y2={height}
            stroke={tickColor}
            fill='transparent'
            strokeWidth='2'/>
          <circle cx={biasThumbX} cy={trackMidY} r={thumbSize} />
          <line
            x1={biasThumbX}
            x2={valueThumbX}
            y1={trackMidY}
            y2={trackMidY}
            stroke={actualColor}
            fill='transparent'
            strokeWidth={trackHeight} />
        </g>
        <ScaleSliderSVG scale={scale}
          perturb={perturb}
          width={scaleWidth}
          height={scaleHeight}
          onChange={onScaleChange}
          scaleArrowFill={scaleArrowFill}
          scaleBackingFill={scaleBackingFill}
          perturbArrowFill={perturbArrowFill}
          transform={`translate(${scaleLeft},${0})`} />
        <line
          x1={biasThumbX}
          x2={scaleMidX}
          y1={trackMidY}
          y2={scaleMidY}
          stroke={binderColor}
          fill='transparent'
          strokeWidth='2'/>
      </g>)
    return c
  };
}

ArchimedeanSliderSVG.propTypes = {
  bias: PropTypes.number,
  scale: PropTypes.number,
  perturbedValue: PropTypes.number,
  perturb: PropTypes.number,
  onBiasChange: PropTypes.func,
  onScaleChange: PropTypes.func,
  className: PropTypes.string,
  transform: PropTypes.string,
}

export default ArchimedeanSliderSVG;
