import React, { Component, PropTypes } from 'react'
import Icon from './Icon'

const Add = ({ onClick}) => (
  <Icon name="plus-circle" onClick={onClick} />
)

Add.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default Add;
