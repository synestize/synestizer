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
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default ArchimedeanSlider
