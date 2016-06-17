"use strict";
import React, { Component, PropTypes } from 'react'

const Pane = ({paneId, children}) => (
  <section className="pane-content" key={paneId} id={paneId}>
    {children}
  </section>
)
Pane.propTypes = {
  paneId: React.PropTypes.string.isRequired,
  children: React.PropTypes.node.isRequired
}

export default Pane;
