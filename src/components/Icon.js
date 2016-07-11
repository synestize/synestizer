import React, { Component, PropTypes } from 'react'

const Icon = ({ name, onClick}) => (
  <i className={'fa fa-'+ name} onClick={onClick}></i>
)

Icon.propTypes = {
  onClick: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
}

export default Icon;
