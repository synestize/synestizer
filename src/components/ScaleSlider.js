import React from 'react';
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


export default ScaleSlider
