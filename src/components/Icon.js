import React, { Component, PropTypes } from 'react'

const Icon = ({
    name,
    onClick,
    className=''
  }) => (
  <i className={'fa fa-' + name + ' ' + className}
    onClick={onClick}></i>
)

Icon.propTypes = {
  onClick: PropTypes.func,
  name: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default Icon;
