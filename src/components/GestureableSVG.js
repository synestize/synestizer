import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import ScaleSliderSVG from './ScaleSliderSVG'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/sampleTime';

class GestureableSVG extends Component{
  constructor(props) {
    super(props);
    this.inGesture = false;
    this.gestureStartX = 0;
    this.gestureStartY = 0;
    this.gestureStartVal = props.value || 0.0
  }
  handleMouseDown = (e) => {
    this.inGesture = true;
    // console.debug('mouseisDOWN', e, UI_PERIOD_MS)
    this.rawGestureSubscription = Observable.fromEvent(
      document, 'mousemove'
    ).sampleTime(UI_PERIOD_MS).subscribe(this.handleMouseMove);
    // Hack bypasses react and also SVG's limitations about mouse behaviour
    document.addEventListener('mouseup', this.handleMouseUp, false);
    this.gestureStartX = e.clientX;
    this.gestureStartY = e.clientY;
    this.gestureStartVal = this.props.value;
  }
  handleMouseUp = (e) => {
    this.inGesture = false;
    document.removeEventListener('mouseup', this.handleMouseUp, false);
    this.rawGestureSubscription.unsubscribe()
    document.removeEventListener('mousemove', this.handleMouseMove, false);
  }
  handleMouseMove = (e) => {
    // console.debug('mouseisDOWN', e.clientX,this.gestureStartX, this.props.width, UI_PERIOD_MS)
    if (this.inGesture) {
      e.stopPropagation()
      e.preventDefault()
      let delta = 2.0 * (e.clientX-this.gestureStartX) / this.props.width
      this.props.onChange(
        Math.max(-1, Math.min(1, this.gestureStartVal + delta)));
    }
  }
  componentWillUnmount = () => {
    document.removeEventListener('mouseup', this.handleMouseUp, false);
  }
  handleDoubleClick = (e) => {
    this.props.onDoubleClick();
  }
  render = () => {
    let {
      value=0,
      onDoubleClick,
      onChange,
      transform='',
    } = this.props;

    /* events NOT managed through React
    * onMouseMove={this.handleMouseMove}
    * onTouchStart={this.handleTouchStart}
    * onTouchEnd={this.handleTouchEnd}
    * onTouchMove={this.handleTouchMove}
    *  onMouseUp={this.handleMouseUp}
    */


    let c = (<g
      transform={transform}
      onMouseDown={this.handleMouseDown}
      onDoubleClick={this.handleDoubleClick}
    >
      {this.props.children}
      </g>)
    return c
  };
}

GestureableSVG.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  onDoubleClick: PropTypes.func,
  transform: PropTypes.string,
}

export default GestureableSVG;
