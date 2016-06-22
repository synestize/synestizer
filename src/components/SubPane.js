"use strict";
import React, { Component, PropTypes } from 'react'

const SubPane = ({name, title, children}) => (
  <section className={"subpane " + name}>
    <h2>{title}</h2>
    {children}
  </section>
)
SubPane.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default SubPane;
