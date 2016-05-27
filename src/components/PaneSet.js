"use strict";
import React, { Component, PropTypes } from 'react'
import shallowCompare from 'react-addons-shallow-compare'

const PaneSet = () => <div>{this.props.children}</div>;
PaneSet.propTypes = {
  active: PropTypes.bool.isRequired,
  children: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.element
  ]).isRequired,
}

export default PaneSet;
