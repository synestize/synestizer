import React, { Component, PropTypes } from 'react'
import BrandingBox from './BrandingBox'

const Pane = ({paneId, children}) => (
  <section className={'pane-wrapper ' + paneId} id={paneId}>
    <BrandingBox />
    <div className='pane-content'>
      {children}
    </div>
  </section>
)
Pane.propTypes = {
  paneId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default Pane;
