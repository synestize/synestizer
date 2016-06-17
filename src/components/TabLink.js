import React, { Component, PropTypes } from 'react'

const TabLink = ({active, children, onClick}) => (
  <a href="#" className={active ? "active" : ""}
     onClick={e => {
       e.preventDefault()
       if (!active) {onClick()}
     }}
  >
    {children}
  </a>
)

TabLink.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired
}

export default TabLink;
