import React, { Component, PropTypes } from 'react'
import SelectTabLink from '../containers/SelectTabLink'

const TabNav = () => {
  return (<nav className="tabnav"><ul className="tabs">
    <li>
      <SelectTabLink paneId="welcome" >
        About
      </SelectTabLink>
    </li>
    <li>
      <SelectTabLink paneId="io" >
        IO
      </SelectTabLink>
    </li>
    <li>
      <SelectTabLink paneId="video">
        Video
      </SelectTabLink>
    </li>
  </ul></nav>)
}
export default TabNav;
