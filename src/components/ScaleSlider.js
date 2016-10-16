import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import SVG from './SVG'
import ScaleSliderSVG from './ScaleSliderSVG'

const ScaleSlider = (props) => {
  return (<SVG
        width={props.width}
        height={props.height}
      >
      <ScaleSliderSVG {...props} />
    </SVG>
  )
};

ScaleSlider.propTypes = {
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

export default ScaleSlider
