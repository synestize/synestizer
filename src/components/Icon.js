import React from 'react'

const Icon = ({
    name,
    onClick,
    className=''
  }) => (
  <i className={'fa fa-' + name + ' ' + className}
    onClick={onClick}></i>
)


export default Icon;
