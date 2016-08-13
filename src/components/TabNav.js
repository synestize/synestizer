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
        Hardware
      </SelectTabLink>
    </li>
    <li>
      <SelectTabLink paneId="patching">
        Patching
      </SelectTabLink>
    </li>
    <li>
      <SelectTabLink paneId="sound">
        Sound
      </SelectTabLink>
    </li>
    <li>
      <SelectTabLink paneId="performance">
        Performance
      </SelectTabLink>
    </li>
  </ul></nav>)
}
export default TabNav;
