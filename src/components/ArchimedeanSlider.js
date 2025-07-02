import React from 'react';
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


export default ArchimedeanSlider
