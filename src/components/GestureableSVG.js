import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'
import ScaleSliderSVG from './ScaleSliderSVG'
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';

/*
TODO: handle touchcancel and mouseout
*/

class GestureableSVG extends Component{
  constructor(props) {
    super(props);
  }
  handleMove = ({currX, currY, startVal, startX, startY}) => {
    let delta = 2.0 * (currX-startX) / this.props.width
    this.props.onChange(
      Math.max(-1, Math.min(1, startVal + delta)));
  }
  handleMouseDown = (e) => {
    let startX = e.clientX;
    let startY = e.clientY;
    let startVal = this.props.value || 0.0;
    let mouseupObs = Observable.fromEvent(
      document, 'mouseup').take(1);
    let mouseMoveObs = Observable.fromEvent(
      document, 'mousemove'
    ).takeUntil(
      mouseupObs
    ).sampleTime(UI_PERIOD_MS).subscribe((e)=>{
      console.debug('mousemove', e, this);
      e.stopPropagation()
      e.preventDefault()
      this.handleMove({
        currX: e.clientX,
        currY: e.clientY,
        startVal: startVal,
        startX: startX,
        startY: startY
      })
    });
  }
  handleTouchStart = (e) => {
    console.debug('touched', e.targetTouches[0]);
    // subtlety: there can be MANY touchstarts per thingy
    let touchId = e.targetTouches[0].identifier;
    let startX = e.clientX;
    let startY = e.clientY;
    let startVal = this.props.value || 0.0;
    let touchupObs = Observable.fromEvent(
      document, 'touchup').take(1);
    let touchMoveObs = Observable.fromEvent(
      document, 'touchmove'
    ).takeUntil(
      touchupObs
    ).sampleTime(UI_PERIOD_MS).subscribe((e)=>{
      console.debug('touchmove', e, this);
      // e.stopPropagation()
      // e.preventDefault()
      this.handleMove({
        currX: e.clientX,
        currY: e.clientY,
        startVal: startVal,
        startX: startX,
        startY: startY
      })
    });

  }

  componentWillUnmount = () => {
    // Am not sure how to handle cleanup any more.
    // Maybe RxJs does this automatically?
    // document.removeEventListener('mouseup', this.handleMouseUp, false);
    // document.removeEventListener('touchend', this.handleTouchStart, false);
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

    let c = (<g
      transform={transform}
      onMouseDown={this.handleMouseDown}
      onDoubleClick={this.handleDoubleClick}
      onTouchStart={this.handleTouchStart}
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
