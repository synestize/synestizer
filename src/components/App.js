import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import ArchimedeanSlider from './ArchimedeanSlider'
import ScaleSlider from './ScaleSlider'

class App extends Component{
  constructor(props) {
    super(props);
    this.state = {
      bias: 0.5,
      scale: 0.5,
      value: 0.75,
      perturb: -0.25
    }
  }
  render = ()=> {
    return (<div className="meh" >
      <ArchimedeanSlider
        className="test-class-1"
        onBiasChange={(val)=>{
          this.setState({'bias': val})
        }}
        onBiasDoubleClick={()=>{
          this.setState({'bias': 0.0})
        }}
        onScaleChange={(val)=>{
          this.setState({'scale': val})
        }}
        onScaleDoubleClick={()=>{
          this.setState({'scale': 0.0})
        }}        height={50}
        width={200}
        {...this.state} />
    </div>)
  }
};

App.propTypes = {
}

export default App
