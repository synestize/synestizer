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
  onBiasChange
}) => {

  return (<div className={"param-control " + className} >
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
