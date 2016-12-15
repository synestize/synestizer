import React, { Component, PropTypes } from 'react'

const SubPane = ({title, children, className=''}) => {
  let titleBlock = "";
  if (title) {
    titleBlock= (<h2>{title}</h2>)
  }
  return (
    <section className={`subpane ${className}`}>
      {titleBlock}
      {children}
    </section>
  )
}
SubPane.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default SubPane;
