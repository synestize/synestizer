import React, { Component, PropTypes } from 'react'

const Add = ({ onClick}) => (
  <span onClick={onClick}>
    +
  </span>
)

Add.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default Add;
