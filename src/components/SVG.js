import React, { Component, PropTypes, Children } from 'react';
import {bipolPerc} from '../lib/transform'

const SVG = ({
  children=0.5,
  width=80,
  height=80,
}) => {
  return (<svg
        width={width}
        height={height}
        xmlns='http://www.w3.org/2000/svg'
        xmlnsXlink='http://www.w3.org/1999/xlink'
      >
      {children}
    </svg>
  )
};

SVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  children: PropTypes.node.isRequired
}

export default SVG
