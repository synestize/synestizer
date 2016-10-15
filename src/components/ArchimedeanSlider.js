import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'

const ArchimedeanSlider = ({
  bias=0,
  scale=0,
  value=0,
  perturb=0,
  className="",
  height=100,
  width=200,
  onScaleChange,
  onBiasChange,
  fill
}) => {

  return (<div className={"param-control " + className} >
      <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <style>
            { `.classA { fill:${fill} }` }
        </style>
        <defs>
            <g id="Port">
                <circle style={{fill:'inherit'}} r="10"/>
            </g>
        </defs>

        <text y="15">black</text>
        <use x="70" y="10" xlinkHref="#Port" />
        <text y="35">{ fill }</text>
        <use x="70" y="30" xlinkHref="#Port" className="classA"/>
        <text y="55">blue</text>
        <use x="0" y="50" xlinkHref="#Port" style={{fill:'blue'}}/>
      </svg>
    {bias}/{scale}/{value}/{perturb}
  </div>)
};

ArchimedeanSlider.propTypes = {
  bias: PropTypes.number,
  scale: PropTypes.number,
  value: PropTypes.number,
  perturb: PropTypes.number,
  onBiasChange: PropTypes.func.isRequired,
  onScaleChange: PropTypes.func.isRequired,
}

export default ArchimedeanSlider
