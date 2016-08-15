import React, { Component, PropTypes } from 'react'
import BrandingBox from './BrandingBox'

const Pane = ({paneId, children, version}) => (
  <section className={'pane-wrapper ' + paneId} id={paneId}>
    <BrandingBox version={version}/>
    <div className='pane-content'>
      {children}
    </div>
  </section>
)
Pane.propTypes = {
  paneId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  version: PropTypes.string.isRequired
}

export default Pane;
