import React from 'react'

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

export default Link;
