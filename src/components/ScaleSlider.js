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
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
}

export default ScaleSlider
