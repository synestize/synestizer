"use strict";
import { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

export default class App extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  render() {
    return <div className={this.props.className}>foo</div>;
  }
}
