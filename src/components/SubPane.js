"use strict";
import React, { Component, PropTypes } from 'react'

const SubPane = ({name, title, children}) => {
  let titleBlock = "";
  if (title) {
    titleBlock= (<h2>{title}</h2>)
  }
  return (
    <section className={"subpane " + name}>
      {titleBlock}
      {children}
    </section>
  )
}
SubPane.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default SubPane;
