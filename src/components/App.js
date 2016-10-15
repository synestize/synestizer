import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import ArchimedeanSlider from './ArchimedeanSlider'
import ScaleSlider from './ScaleSlider'

const App = ({}) => {
  return (<div className="meh" >
    <ScaleSlider />
    <ArchimedeanSlider
      className="test-class-1"
      bias={0.5}
      scale={0.5}
      value={0.75}
      perturb={-0.25}
      onBiasChange={()=>null}
      onScaleChange={()=>null}
      height={50}
      width={200} />
  </div>)
};

App.propTypes = {
}

export default App
