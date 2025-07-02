import React from 'react'
import BrandingBox from './BrandingBox'

const Pane = ({paneId, children}) => (
  <section className={'pane-wrapper ' + paneId} id={paneId}>
    <BrandingBox />
    <div className='pane-content'>
      {children}
    </div>
  </section>
)

export default Pane;
