import React, { Component, PropTypes } from 'react'

const Link = ({active, children, onClick}) => (
  <a href="#" className={active ? "active" : ""}
     onClick={e => {
       e.preventDefault()
       if (!active) {onClick()}
     }}
  >
    {children}
  </a>
)

Link.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
}

export default Link;
