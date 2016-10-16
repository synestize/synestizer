import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import SVG from './SVG'
import ArchimedeanSliderSVG from './ArchimedeanSliderSVG'

const ArchimedeanSlider = (props) => {
  return (<SVG
        width={props.width}
        height={props.height}
      >
      <ArchimedeanSliderSVG {...props} />
    </SVG>
  )
};

ArchimedeanSlider.propTypes = {
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

export default ArchimedeanSlider
